import { Express } from 'express';
import { Server, Socket } from 'socket.io';
import { Screen, screenMap } from './screens';
import { Database, SavedPlayer } from './db';
import { Player } from './entities';
import {
  CollisionLayer,
  Keys,
  otherScreen,
  ireland,
  afghanistan,
  defaultScreen,
  iraq,
} from '@core';
import EventEmitter from 'events';

interface SavedClient {
  player?: SavedPlayer;
  client: Socket;
}

const HOST = '0.0.0.0';
const PORT = parseInt(process.env.PORT || '8080', 10);

const ScreenListener = new EventEmitter();

const getNextScreenKey = (screenPosition: { x: number; y: number; z: number }, dir: Keys) => {
  const { x, y, z } = screenPosition;
  switch (dir) {
    case Keys.RIGHT:
      return `${x + 1},${y},${z}`;
    case Keys.DOWN:
      return `${x},${y - 1},${z}`;
    case Keys.UP:
      return `${x},${y + 1},${z}`;
    case Keys.LEFT:
      return `${x - 1},${y},${z}`;
  }
};



const buildNewScreens = (io: any) => {
  const screens = {};
  Object.entries(screenMap).forEach(([k, v]) => {
    const coords = k.split(',');  
    screens[k] = new Screen({ x: parseInt(coords[0], 10), y: parseInt(coords[1], 10), z: 0}, io);
  });
  return screens;
}



export class Game {
  private map;
  private server;
  private io: Server;
  private clients: { [key: string]: SavedClient } = {};
  private db: Database;

  constructor(app: Express, db: Database) {
    this.server = app.listen(PORT, HOST);
    this.db = db;

    this.io = new Server(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    const io = this.io;
    const defaultMap = {
      ...buildNewScreens(io),
      getScreenByCoordinates(x: number, y: number, z: number): Screen | undefined {
        return this[`${x},${y},${z}`];
      },
      getScreenByKey(screenKey: string): Screen | undefined {
        return this[screenKey];
      },
      addScreen(pos: { x: number; y: number; z: number }) {
        this[`${pos.x},${pos.y},${pos.z}`] = new Screen(pos, io);
      },
    };

    this.map = defaultMap;

    this.init();
  }

  init() {
    this.io.on('connection', (client) => {
      this.clients[client.id] = { client };

      client.on('join', (id) => {
        const savedPlayer = this.db.getPlayerById(id);

        const playerEntity = new Player(
          {
            name: savedPlayer.username,
            color: savedPlayer.color,
            size: {
              height: 54,
              width: 54,
            },
            position: savedPlayer.position,
            speed: 1.5,
            screenKey: savedPlayer.screenKey,
            collide: true,
            collisionMap: {
              [CollisionLayer.PLAYERS]: true,
              [CollisionLayer.ENEMIES]: true,
              [CollisionLayer.ITEMS]: true,
              [CollisionLayer.ENVIRONMENT]: true,
            },
          },
          ScreenListener,
          client.id
        );

        ScreenListener.on(
          `change-${client.id}`,
          ({
            player,
            screenKey,
            direction,
          }: {
            player: Player;
            screenKey: string;
            direction: Keys;
          }) => {
            const oldScreen: Screen | undefined = this.map.getScreenByKey(player.state.screenKey);
            if (oldScreen) {
              const newScreenKey = getNextScreenKey(oldScreen.position, direction) || '';
              const newScreen: Screen | undefined = this.map.getScreenByKey(newScreenKey);
              if (oldScreen && newScreen) {
                oldScreen.removePlayer(client.id);
                newScreen.addPlayer(playerEntity, client);
                let position = { x: 0, y: 0 };
                // set new position
                switch (direction) {
                  case Keys.LEFT:
                    position = { y: player.state.position.y, x: 1296 - 54 };
                    break;
                  case Keys.RIGHT:
                    position = { y: player.state.position.y, x: 0 };
                    break;
                  case Keys.UP:
                    position = { y: 864 - 54, x: player.state.position.x };
                    break;
                  case Keys.DOWN:
                    position = { y: 0, x: player.state.position.x };
                    break;
                }

                playerEntity.state.position = position;
                playerEntity.state.screenKey = newScreenKey;
              }
            }
          }
        );

        this.clients[client.id].player = savedPlayer;

        const screen = this.map.getScreenByKey(savedPlayer.screenKey);

        if (screen) {
          screen.addPlayer(playerEntity, client);
        }

        client.on('disconnecting', () => {
          const rooms = client.rooms;
          if (rooms.size) {
            const values = rooms.values();
            values.next();
            const screenKey = values.next().value;
            const screen = this.map.getScreenByKey(screenKey);
            const leavingPlayer = screen.removePlayer(client.id);

            client.on('disconnect', () => {
              const passwordDigest = this.db.getPlayerById(id).passwordDigest;

              this.db.save({
                id,
                position: leavingPlayer.state.position,
                color: leavingPlayer.state.color,
                passwordDigest,
                username: leavingPlayer.state.name,
                screenKey,
              });
            });
          }
        });
      });
    });
  }
}

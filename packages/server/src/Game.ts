import { Express } from 'express';
import { Server, Socket } from 'socket.io';
import { Screen } from './screens';
import { Database, SavedPlayer } from './db';
import { Player } from './entities';
import {
  CollisionLayer,
  Keys,
  ScreenState,
  MapType,
  generateMap,
} from '@core';
import EventEmitter from 'events';

interface SavedClient {
  player?: SavedPlayer;
  client: Socket;
}

interface ScreenMap {
  [key: string]: ScreenState;
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
      return `${x},${y + 1},${z}`;
    case Keys.UP:
      return `${x},${y - 1},${z}`;
    case Keys.LEFT:
      return `${x - 1},${y},${z}`;
  }
};

const buildGameScreens = (io: Server, screenMap: ScreenMap) => {
  const screens = {};
  Object.entries(screenMap).forEach(([k, v]) => {
    let [x,y] = k.split(',');
    const locX = parseInt(x, 10);
    const locY = parseInt(y, 10);
    const locZ = 0;
    screens[k] = new Screen({ x: locX, y: locY, z: locZ}, screenMap[k], io);
  });
  return screens;
}

const mapConfig = { screenMultiplier: 25, frequency: 10, redistribution: 1.9, mapType: MapType.GAME_MAP };

interface ScreenData {
  screenMap: ScreenMap,
  screenMapHeight: number,
  screenMapWidth: number,
}
export class Game {
  private map;
  private screenData: ScreenData;
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

    const { screenMap, screenMapHeight, screenMapWidth } = generateMap(mapConfig);

    this.screenData = {
      screenMap,
      screenMapHeight,
      screenMapWidth,
    };

    const defaultMap = {
      ...buildGameScreens(io, this.screenData.screenMap),
      getScreenByCoordinates(x: number, y: number, z: number): Screen | undefined {
        return this[`${x},${y},${z}`];
      },
      getScreenByKey(screenKey: string): Screen | undefined {
        return this[screenKey];
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

        client.emit('map', {height: this.screenData.screenMapHeight, width: this.screenData.screenMapWidth});

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

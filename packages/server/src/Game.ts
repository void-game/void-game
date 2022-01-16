import { Express } from 'express';
import { Server, Socket } from 'socket.io';
import { Screen } from './screens';
import { Database, SavedPlayer } from './db';
import { Player } from './entities';

interface SavedClient {
  player?: SavedPlayer;
  client: Socket;
}

const HOST = '0.0.0.0';
const PORT = parseInt(process.env.PORT || '8080', 10);

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
      '0,0,0': new Screen({ x: 0, y: 0, z: 0 }, io),
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
        console.log(savedPlayer);

        const playerEntity = new Player({
          name: savedPlayer.username,
          color: savedPlayer.color,
          size: {
            height: 54,
            width: 54,
          },
          position: savedPlayer.position,
          speed: 1.5,
          screenKey: savedPlayer.screenKey,
        });

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

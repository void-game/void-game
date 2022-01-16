import { Server, Socket } from 'socket.io';
import { Entity, Keys } from '@core';
import { Player } from '../entities';

export interface MapPosition {
  x: number;
  y: number;
  z: number;
}

const isPressed = {
  [Keys.RIGHT]: false,
  [Keys.LEFT]: false,
  [Keys.UP]: false,
  [Keys.DOWN]: false,
  [Keys.SPRINT]: false,
};

export class Screen {
  private _entities: Entity[] = [];
  private _players: { [key: string]: { entity: Player; client: Socket; keys: any } } = {};
  private _position: MapPosition;
  private _key: string;
  private _io: Server;

  constructor(position: MapPosition, io: Server) {
    this._position = position;
    this._key = `${position.x},${position.y},${position.z}`;
    this._io = io;

    setInterval(() => {
      Object.keys(this._players).forEach((k) => {
        if (this._players[k]) {
          const p = this._players[k];
          p.entity.update(p.keys);
          this.broadcastEntities();
        }
      });
    }, 1000 / 120);
  }

  addPlayer(player: Player, client: Socket) {
    const newPlayer = { entity: player, client, keys: { isPressed: { ...isPressed } } };
    this._players[client.id] = newPlayer;

    client.join(this._key);
    this._entities.push(newPlayer.entity);

    client.on('keys', (keys: any) => {
      newPlayer.keys = keys;
      this.broadcastEntities();
    });
  }

  removePlayer(clientId: number): Player {
    const player = this._players[clientId];
    player.client.leave(this._key);

    this._entities = this._entities.filter((p) => p !== player.entity);

    delete this._players[clientId];
    return player.entity;
  }

  broadcastEntities() {
    this._io.to(this._key).emit('entities', this._entities);
  }
}

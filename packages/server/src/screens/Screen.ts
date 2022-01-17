import { Server, Socket } from 'socket.io';
import { Entity, Keys, ScreenState } from '@core';
import { Player } from '../entities';
import { screenMap } from '.';

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
  private _screenState: ScreenState;
  private _key: string;
  private _io: Server;
  public position: MapPosition;

  constructor(position: MapPosition, io: Server) {
    this.position = position;
    this._key = `${position.x},${position.y},${position.z}`;
    this._screenState = screenMap[this._key];
    this._io = io;

    setInterval(() => {
      Object.keys(this._players).forEach((k) => {
        if (this._players[k]) {
          const p = this._players[k];
          p.entity.update(p.keys, this._screenState);
          this.broadcastEntities();
        }
      });
    }, 1000 / 120);
  }

  addPlayer(player: Player, client: Socket) {
    if (!this._players[client.id]) {
      const newPlayer = { entity: player, client, keys: { isPressed: { ...isPressed } } };
      this._players[client.id] = newPlayer;

      client.join(this._key);
      this._entities.push(newPlayer.entity);

      client.emit('screen', { screen: this._screenState, entities: this._entities });

      client.on('keys', (keys: any) => {
        newPlayer.keys = keys;
        this.broadcastEntities();
      });
    }
  }

  removePlayer(clientId: string): Player {
    if (this._players[clientId]) {
      const player = this._players[clientId];
      player.client.leave(this._key);

      this._entities = this._entities.filter((p) => p.state.name !== player.entity.state.name);

      delete this._players[clientId];
      return player.entity;
    }

    return {} as Player;
  }

  broadcastEntities() {
    this._io.to(this._key).emit('entities', this._entities);
  }
}

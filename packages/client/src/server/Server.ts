import { io, Socket } from 'socket.io-client';
import { Entity } from '@core';

class Server {
  private _socket: Socket;
  private _entities: Entity[];

  constructor(id: string) {
    this._socket = io('http://localhost:8080');
    this._entities = [];

    this._socket.on('connect', () => {
      console.log('connected');
      this._socket.emit('join', id);
    });
  }

  get socket(): Socket {
    return this._socket;
  }

  get entities() {
    return this._entities;
  }
}

export default Server;

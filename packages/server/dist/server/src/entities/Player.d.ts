/// <reference types="node" />
import { EntityState, Entity, ScreenState } from '@core';
import { EventEmitter } from 'events';
export declare class Player implements Entity {
  state: EntityState;
  private ScreenListener;
  private clientId;
  constructor(
    {
      name,
      color,
      speed,
      position: { x, y },
      size: { height, width },
      screenKey,
      collide,
      collisionMap,
    }: EntityState,
    ScreenListener: EventEmitter,
    clientId: string
  );
  private findTileByPosition;
  findNearestTiles(): {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  private handleCollisions;
  update: (keys: any, screenState: ScreenState) => void;
}

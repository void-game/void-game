import { EntityState, Entity, ScreenState } from '@core';
export declare class Player implements Entity {
    state: EntityState;
    constructor({ name, color, speed, position: { x, y }, size: { height, width }, screenKey, collide, collisionMap, }: EntityState);
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

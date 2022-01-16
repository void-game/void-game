import { EntityState, Entity } from '@core';
export declare class Player implements Entity {
    state: EntityState;
    constructor({ name, color, speed, position: { x, y }, size: { height, width }, }: EntityState);
    update: (keys: any) => void;
}

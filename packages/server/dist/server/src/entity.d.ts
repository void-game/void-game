import { EntityState, Entity } from '@core';
export declare class Player implements Entity {
    private _state;
    constructor({ name, color, speed, position: { x, y }, size: { height, width }, }: EntityState);
    get state(): EntityState;
    update: (keys: any) => void;
}

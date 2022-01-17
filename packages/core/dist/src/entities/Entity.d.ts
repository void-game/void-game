import { CollisionMap } from '../collision';
export interface EntityState {
    name: string;
    color: string;
    size: {
        height: number;
        width: number;
    };
    position: {
        x: number;
        y: number;
    };
    speed: number;
    screenKey: string;
    collide: boolean;
    collisionMap: CollisionMap;
}
export interface Entity {
    state: EntityState;
}

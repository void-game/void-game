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
}
export interface Entity {
    state: EntityState;
    update: (keys: any) => void;
}
export declare class Player implements Entity {
    state: EntityState;
    constructor({ name, color, speed, position: { x, y }, size: { height, width } }: EntityState);
    update: (keys: any) => void;
}

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
}

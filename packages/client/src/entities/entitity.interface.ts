export interface EntityState {
  name: string,
  color: string,
  size: {
    height: number,
    width: number,
  },
  position: {
    x: number,
    y: number,
  },
  speed: number,
}


interface Entity {
  state: EntityState;
  update: () => void,
  render: (context: CanvasRenderingContext2D, ratio: number) => void,
}

export default Entity;
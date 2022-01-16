import keys from "../keys/onKeyDown";
import Entity, { EntityState } from "./entitity.interface";

class Player implements Entity {
  private _state: EntityState;

  constructor({ 
    name = "Joe",
    color = "blue",
    speed = 1.5,
    position: {
      x = 0,
      y = 0
    },
    size: { 
      height = 20,
      width = 20
    }
  }: EntityState) {
    this._state = {
      name,
      color,
      speed,
      position: { x, y },
      size: { height, width }
    };
  }

  get state() {
    return this._state;
  }

  render = (context: CanvasRenderingContext2D, ratio: number) => {
    // console.log('xx width, width * ratio', this._state.size.width, this._state.size.width * ratio); // eslint-disable-line
    context.fillStyle = 'blue';
    context.fillRect(
      this._state.position.x,
      this._state.position.y,
      this.state.size.width * ratio,
      this.state.size.height * ratio,
    );
  }

  update = () => {
    if (keys.isPressed.left) {
      this.state.position.x -= this.state.speed;
    }

    if (keys.isPressed.right) {
      this.state.position.x += this.state.speed;
    }

    if (keys.isPressed.up) {
      this.state.position.y -= this.state.speed;
    }

    if (keys.isPressed.down) {
      this.state.position.y += this.state.speed;
    }
  }
}

export default Player;
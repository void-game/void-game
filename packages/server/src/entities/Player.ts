import { EntityState, Entity, Keys, CollisionLayer, ScreenState, letters } from '@core';

const SPRINT_SPEED = 4;

// Environment constants
const SCREEN_HEIGHT = 864;
const SCREEN_WIDTH = 1296;

export class Player implements Entity {
  public state: EntityState;

  constructor({
    name = 'Joe',
    color = 'blue',
    speed = 100,
    position: { x = 0, y = 0 },
    size: { height = 20, width = 20 },
    screenKey,
    collide = true,
    collisionMap = {
      [CollisionLayer.PLAYERS]: true,
      [CollisionLayer.ENEMIES]: true,
      [CollisionLayer.ITEMS]: true,
      [CollisionLayer.ENVIRONMENT]: true,
    },
  }: EntityState) {
    this.state = {
      name,
      color,
      speed,
      position: { x, y },
      size: { height, width },
      screenKey,
      collide,
      collisionMap,
    };
  }

  private findTileByPosition(x: number, y: number) {
    const tileX = Math.floor(x / 54);
    const tileY = Math.floor(y / 54);

    const tileLetter = letters[tileY];

    const tileKey = `${tileLetter}${tileX}`;
    return tileKey;
  }

  public findNearestTiles() {
    const topLeft = this.findTileByPosition(this.state.position.x, this.state.position.y);
    const topRight = this.findTileByPosition(
      this.state.position.x + this.state.size.width,
      this.state.position.y
    );
    const bottomLeft = this.findTileByPosition(
      this.state.position.x,
      this.state.position.y + this.state.size.height
    );
    const bottomRight = this.findTileByPosition(
      this.state.position.x + this.state.size.width,
      this.state.position.y + this.state.size.height
    );

    return { topLeft, topRight, bottomLeft, bottomRight };
  }

  private handleCollisions(screenState: ScreenState, speed: number, direction: Keys) {
    const nearestTiles = this.findNearestTiles();

    Object.entries(nearestTiles).forEach(([key, value]) => {
      const cell = screenState[value];
      if (cell && cell.tile.collide) {
        switch (direction) {
          case Keys.LEFT:
            this.state.position.x += speed;
            break;
          case Keys.RIGHT:
            this.state.position.x -= speed;
            break;
          case Keys.DOWN:
            this.state.position.y -= speed;
            break;
          case Keys.UP:
            this.state.position.y += speed;
            break;
        }
      }
    });
  }

  update = (keys: any, screenState: ScreenState) => {
    const speed = keys.isPressed.sprint ? SPRINT_SPEED : this.state.speed;

    if (keys.isPressed[Keys.LEFT]) {
      this.state.position.x -= speed;
      this.handleCollisions(screenState, speed, Keys.LEFT);
    }

    if (keys.isPressed[Keys.RIGHT]) {
      this.state.position.x += speed;
      this.handleCollisions(screenState, speed, Keys.RIGHT);
    }

    if (keys.isPressed[Keys.UP]) {
      this.state.position.y -= speed;
      this.handleCollisions(screenState, speed, Keys.UP);
    }

    if (keys.isPressed[Keys.DOWN]) {
      this.state.position.y += speed;
      this.handleCollisions(screenState, speed, Keys.DOWN);
    }
  };
}

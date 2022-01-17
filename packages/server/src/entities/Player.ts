import { EntityState, Entity, Keys, CollisionLayer, ScreenState, letters } from '@core';
import { EventEmitter } from 'events';

const SPRINT_SPEED = 4;

// Environment constants
const SCREEN_HEIGHT = 864;
const SCREEN_WIDTH = 1296;

export class Player implements Entity {
  public state: EntityState;
  private ScreenListener: EventEmitter;
  private clientId: string;

  constructor(
    {
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
    }: EntityState,
    ScreenListener: EventEmitter,
    clientId: string
  ) {
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

    this.ScreenListener = ScreenListener;
    this.clientId = clientId;
  }

  private findTileByPosition(x: number, y: number) {
    const tileX = Math.floor(x / 54);
    const tileY = Math.floor(y / 54);

    const tileLetter = letters[tileY];

    const tileKey = `${tileLetter}${tileX}`;
    return [tileKey, tileX, tileY];
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

    let leftScreen = false;

    Object.entries(nearestTiles).forEach(([key, value]) => {
      if (leftScreen) return;
      // handle environment collisions
      const [tileKey, tileX, tileY] = value;
      const cell = screenState[tileKey];
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
      } else if ((!cell && direction === Keys.LEFT) || direction === Keys.UP) {
        // if no cell, out of bounds
        switch (key) {
          case 'bottomLeft':
            const { bottomRight } = nearestTiles;
            const [_, x, y] = bottomRight;

            if ((x < 0 || y < 0) && (tileX < 0 || tileY < 0)) {
              this.ScreenListener.emit(`change-${this.clientId}`, {
                player: this,
                screenKey: this.state.screenKey,
                direction,
              });

              leftScreen = true;
            }
            break;
          case 'bottomRight':
            const { bottomLeft } = nearestTiles;
            const [__, xx, yy] = bottomLeft;

            if ((xx < 0 || yy < 0) && (tileX < 0 || tileY < 0)) {
              this.ScreenListener.emit(`change-${this.clientId}`, {
                player: this,
                screenKey: this.state.screenKey,
                direction,
              });

              leftScreen = true;
            }
            break;
        }
      } else if ((!cell && direction === Keys.DOWN) || direction === Keys.RIGHT) {
        switch (key) {
          case 'topLeft':
            const { bottomRight } = nearestTiles;
            const [_, x, y] = bottomRight;

            if ((y > 15 || x > 23) && (tileY > 15 || tileX > 23)) {
              this.ScreenListener.emit(`change-${this.clientId}`, {
                player: this,
                screenKey: this.state.screenKey,
                direction,
              });

              leftScreen = true;
            }
            break;
          case 'topRight':
            const { bottomLeft } = nearestTiles;
            const [__, xx, yy] = bottomLeft;

            if ((yy > 15 || xx > 23) && (tileY > 15 || tileX > 23)) {
              this.ScreenListener.emit(`change-${this.clientId}`, {
                player: this,
                screenKey: this.state.screenKey,
                direction,
              });

              leftScreen = true;
            }
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

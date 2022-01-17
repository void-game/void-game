export enum CollisionLayer {
  PLAYERS = 'players',
  ENVIRONMENT = 'environment',
  ENEMIES = 'enemies',
  ITEMS = 'items',
}

export type CollisionMap = {
  [CollisionLayer.PLAYERS]: boolean;
  [CollisionLayer.ENVIRONMENT]: boolean;
  [CollisionLayer.ENEMIES]: boolean;
  [CollisionLayer.ITEMS]: boolean;
};

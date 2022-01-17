export declare enum CollisionLayer {
    PLAYERS = "players",
    ENVIRONMENT = "environment",
    ENEMIES = "enemies",
    ITEMS = "items"
}
export declare type CollisionMap = {
    [CollisionLayer.PLAYERS]: boolean;
    [CollisionLayer.ENVIRONMENT]: boolean;
    [CollisionLayer.ENEMIES]: boolean;
    [CollisionLayer.ITEMS]: boolean;
};

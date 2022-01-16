interface Position {
    x: number;
    y: number;
}
interface SavedPlayer {
    id: string;
    username: string;
    passwordDigest: string;
    color: string;
    position: Position;
}
export declare function makeid(length: number): string;
declare class Database {
    private _players;
    authenticate(username: string, password: string, color?: string): Promise<SavedPlayer>;
    getPlayerById(id: string): SavedPlayer;
    save(player: SavedPlayer): void;
    findPlayerByUsername(username: string): SavedPlayer | undefined;
}
export default Database;

import Entity from "./entities/entitity.interface";
import Screen from "./screen/screen";
import { registerKeyEvents } from "./keys/onKeyDown";
import Server from "./server/Server";

export interface GameSettings {
  showFPS: boolean,
  targetFPS: number
}

interface RenderState {
  secondsPassed: number;
  previousTimeStamp: DOMHighResTimeStamp | null; 
}

interface GameState {
  entities: Entity[],
}

class Game {
  private screen: Screen;
  private settings: GameSettings;
  private state: GameState;
  private renderState: RenderState;
  private server: Server;

  constructor({ showFPS = false, targetFPS = 60 }: GameSettings, id: string) {
    this.server = new Server(id);

    this.screen = new Screen();

    this.settings = {
      showFPS,
      targetFPS,
    };

    this.state = {
      entities: this.server.entities,
    };
    
    this.renderState = {
      secondsPassed: 0,
      previousTimeStamp: null,
    };

    this.server.server.on('entities', (entities: Entity[]) => {
      this.state.entities = entities;
    })

    registerKeyEvents(this.server);

    // start the main game loop
    window.requestAnimationFrame(this.gameLoop);
  }

  gameLoop = (timeStamp: DOMHighResTimeStamp) => {
    // Calculate the number of seconds passed since the last frame
    this.renderState.secondsPassed = (timeStamp - (this.renderState.previousTimeStamp || 0)) / 1000;
    this.renderState.previousTimeStamp = timeStamp;

    // Calculate FPS
    const fps = Math.round(1 / this.renderState.secondsPassed);

    // Draw FPS counter on screen
    if (this.settings.showFPS) {
      this.screen.drawFPS(fps);
    }

    this.screen.draw(this.state.entities, fps);

    window.requestAnimationFrame(this.gameLoop);
  }
}

export default Game;
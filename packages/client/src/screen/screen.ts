import { Entity, defaultScreen, ScreenState, CellState, MapState } from '@core';

interface CanvasData {
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
}


class Screen {
  private root;
  private mapCanvas: CanvasData;
  private playerCanvas: CanvasData;
  private ratio;
  private height = 864;
  private width = 1296;
  private _screenState;
  private _mapState;
  private _mapLocation;

  // render canvas
  constructor() {
    const root = document.getElementById('root');
    if (!root) throw new Error('no root');
    this.root = root;

    this.mapCanvas = this.generateCanvas();
    this.playerCanvas = this.generateCanvas();

    this.ratio = 1; // this.getPixelRatio(this.context);
    this.mapCanvas.canvas.style.border = '5px solid var(--gameboy-grey)';
    this.mapCanvas.canvas.style.boxSizing = 'border-box';
    this._screenState = defaultScreen;

    this.root?.append(this.mapCanvas.canvas)
    this.root?.append(this.playerCanvas.canvas);

    // update the canvas size to fit the screen
    window.addEventListener('resize', this.resize);
  }

  get screenState() {
    return this._screenState;
  }

  set screenState(screenState: ScreenState) {
    this._screenState = screenState;
    this.renderScreen();
  }

  set mapState(mapState: MapState) {
    this._mapState = mapState;
    console.log(this._mapState);
  }

  set mapLocation({y, x}) {
    this._mapLocation = {posY: y, posX: x};
    console.log(this._mapLocation);
    this.renderMiniMap();
  }


  draw = (entities: Entity[], FPS: number) => {

    // this.drawFPS(FPS);

    entities.forEach((e) => {
      // e.update();
      this.renderEntity(e);
    });
  };

  renderScreen = () => {
    Object.keys(this._screenState).forEach((c) => {
      this.renderCell(this._screenState[c]);
    });
  }

  renderCell = (c: CellState) => {
    this.mapCanvas.context.fillStyle = c.tile.color;
    this.mapCanvas.context.fillRect(
      c.position.x * (this.width / 24),
      c.position.y * (this.height / 16),
      54 * this.ratio,
      54 * this.ratio
    );
  };

  renderEntity = (e: Entity) => {
    // this.playerCanvas.context.clearRect(0, 0, this.playerCanvas.canvas.width, this.playerCanvas.canvas.height);
    this.playerCanvas.context.fillStyle = e.state.color;
    this.playerCanvas.context.fillRect(e.state.position.x, e.state.position.y, 54 * this.ratio, 54 * this.ratio);
    this.playerCanvas.context.font = '20px Arial';
    this.playerCanvas.context.fillStyle = 'white';
    this.playerCanvas.context.textAlign = 'center';
    this.playerCanvas.context.fillText(e.state.name, e.state.position.x + 27, e.state.position.y - 5);
  };

  renderMiniMap = () => {
    const {height, width} = this._mapState;
    const modHeight = height + (1 * height) + 1
    const modWidth = width + (1 * width) + 1;

    this.playerCanvas.context.fillStyle = 'green';
    for (let y = 0; y < modHeight; y++) {
      for (let x = 0; x < modWidth; x++) {
        this.playerCanvas.context.fillRect(x * 10, y * 6, 10, 6);
      }
    }

    this.playerCanvas.context.fillStyle = 'red';
    this.playerCanvas.context.fillRect(this._mapLocation.posX * 10, this._mapLocation.posY * 6, 10, 6);


  }

  // drawFPS = (FPS: number) => {
  //   // this.context.clearRect(0, 0, 200, 100);
  //   this.context.font = '25px Arial';
  //   this.context.fillStyle = 'yellow';
  //   this.context.fillText('FPS: ' + FPS, 10, 30);
  // };

  private resize = () => {
    // Player Canvas Resize
    this.playerCanvas.canvas.height = this.height;
    this.playerCanvas.canvas.width = this.width;
    this.playerCanvas.canvas.style.width = window.innerWidth + 'px';
    this.playerCanvas.canvas.style.height = window.innerHeight + 'px';

    // Map Canvas Resize
    this.mapCanvas.canvas.height = this.height;
    this.mapCanvas.canvas.width = this.width;
    this.mapCanvas.canvas.style.width = window.innerWidth + 'px';
    this.mapCanvas.canvas.style.height = window.innerHeight + 'px';

  };

  private generateCanvas = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('no context');

    canvas.height = this.height;
    canvas.width = this.width;

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    canvas.style.backgroundColor = 'black';

    return { canvas, context };
  };
}

export default Screen;

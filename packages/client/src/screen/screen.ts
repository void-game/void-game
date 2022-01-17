import { Entity, defaultScreen, ScreenState, CellState } from '@core';

class Screen {
  private root;
  private canvas;
  private context;
  private ratio;
  private height = 864;
  private width = 1296;
  private _screenState;

  // render canvas
  constructor() {
    const root = document.getElementById('root');
    if (!root) throw new Error('no root');
    this.root = root;

    const { canvas, context } = this.generateCanvas();
    this.canvas = canvas;
    this.context = context;
    this.ratio = 1; // this.getPixelRatio(this.context);
    this.canvas.style.border = '5px solid var(--gameboy-grey)';
    this.canvas.style.boxSizing = 'border-box';
    this._screenState = defaultScreen;

    this.root?.append(this.canvas);

    // update the canvas size to fit the screen
    window.addEventListener('resize', this.resize);
  }

  get screenState() {
    return this._screenState;
  }

  set screenState(screenState: ScreenState) {
    this._screenState = screenState;
  }

  draw = (entities: Entity[], FPS: number) => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawFPS(FPS);

    Object.keys(this._screenState).forEach((c) => {
      this.renderCell(this._screenState[c]);
    });

    entities.forEach((e) => {
      // e.update();
      this.renderEntity(e);
    });
  };

  renderCell = (c: CellState) => {
    this.context.fillStyle = c.tile.color;
    this.context.fillRect(
      c.position.x * (this.width / 24),
      c.position.y * (this.height / 16),
      54 * this.ratio,
      54 * this.ratio
    );
  };

  renderEntity = (e: Entity) => {
    this.context.fillStyle = e.state.color;
    this.context.fillRect(e.state.position.x, e.state.position.y, 54 * this.ratio, 54 * this.ratio);
    this.context.font = '20px Arial';
    this.context.fillStyle = 'white';
    this.context.textAlign = 'center';
    this.context.fillText(e.state.name, e.state.position.x + 27, e.state.position.y - 5);
  };

  drawFPS = (FPS: number) => {
    // this.context.clearRect(0, 0, 200, 100);
    this.context.font = '25px Arial';
    this.context.fillStyle = 'yellow';
    this.context.fillText('FPS: ' + FPS, 10, 30);
  };

  private resize = () => {
    this.canvas.height = this.height;
    this.canvas.width = this.width;

    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';

    // this.canvas.style.top = `${(window.innerHeight / 2) - (this.canvas.height / 2)}px`;
    // this.canvas.style.left = `${(window.innerWidth / 2) - (this.canvas.width / 2)}px`;
  };

  // private getPixelRatio = (context: CanvasRenderingContext2D) => {
  //   const backingStores = [
  //     'webkitBackingStorePixelRatio',
  //     'mozBackingStorePixelRatio',
  //     'msBackingStorePixelRatio',
  //     'oBackingStorePixelRatio',
  //     'backingStorePixelRatio'
  //   ];

  //   const deviceRatio = window.devicePixelRatio;

  //   const backingRatio = backingStores.reduce((_prev, curr) => {
  //     return (context.hasOwnProperty(curr) ? (context as any)[curr] : 1);
  //   });

  //   return deviceRatio / (backingRatio as unknown as number);
  // };

  private generateCanvas = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('no context');
    // const ratio = this.getPixelRatio(context);

    canvas.height = this.height;
    canvas.width = this.width;

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    // canvas.style.top = `${(window.innerHeight / 2) - (canvas.height / 2)}px`;
    // canvas.style.left = `${(window.innerWidth / 2) - (canvas.width / 2)}px`;

    // context.setTransform(ratio, 0, 0, ratio, 0, 0);

    canvas.style.backgroundColor = 'black';

    return { canvas, context };
  };
}

export default Screen;

export enum Keys {
  RIGHT = 'right',
  LEFT = 'left',
  DOWN = 'down',
  UP = 'up',
  SPRINT = 'sprint',
}

const keyMap = {
  68: Keys.RIGHT,
  65: Keys.LEFT,
  83: Keys.DOWN,
  87: Keys.UP,
  38: Keys.UP,
  37: Keys.LEFT,
  39: Keys.RIGHT,
  40: Keys.DOWN,
  16: Keys.SPRINT,
}

export default keyMap;
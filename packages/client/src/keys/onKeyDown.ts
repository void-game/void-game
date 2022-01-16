import Server from "../server/Server";
import keyMap, { Keys } from "./keys";

const isPressed = {
  [Keys.RIGHT]: false,
  [Keys.LEFT]: false,
  [Keys.UP]: false,
  [Keys.DOWN]: false,
};

const registerKeyEvents = (server: Server) => {
  document.onkeydown = (e: KeyboardEvent) => {
    const key = ((keyMap as any)[e.keyCode]) as Keys | undefined;
    if (key) {
      switch (key) {
        case Keys.RIGHT:
          isPressed[Keys.RIGHT] = true;
          break;
        case Keys.LEFT:
          isPressed[Keys.LEFT] = true;
          break;
        case Keys.DOWN:
          isPressed[Keys.DOWN] = true;
          break;
        case Keys.UP:
          isPressed[Keys.UP] = true;
          break;
        case Keys.SPRINT:
          isPressed[Keys.SPRINT] = true;
          break;
      }
    }

    server.server.emit('keyDown', { isPressed });
  }

  document.onkeyup = (e: KeyboardEvent) => {
    const key = ((keyMap as any)[e.keyCode]) as Keys | undefined;
    if (key) {
      switch (key) {
        case Keys.RIGHT:
          isPressed[Keys.RIGHT] = false;
          break;
        case Keys.LEFT:
          isPressed[Keys.LEFT] = false;
          break;
        case Keys.DOWN:
          isPressed[Keys.DOWN] = false;
          break;
        case Keys.UP:
          isPressed[Keys.UP] = false;
          break;
        case Keys.SPRINT:
          isPressed[Keys.SPRINT] = false;
          break;
      }
    }

    server.server.emit('keyDown', { isPressed });
  }
}

const keys = { isPressed };
export default keys;
export { registerKeyEvents };
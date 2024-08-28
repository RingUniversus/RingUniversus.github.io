import { EventEmitter } from "eventemitter3";

export const enum GameEmitterEvent {
  PlayerUpdated = "PlayerUpdated",
  TownUpdated = "TownUpdated",
}

class GameEmitter extends EventEmitter {
  static instance: EventEmitter;

  private constructor() {
    super();
  }

  static getInstance(): GameEmitter {
    if (!GameEmitter.instance) {
      GameEmitter.instance = new GameEmitter();
    }

    return GameEmitter.instance;
  }

  static initialize(): GameEmitter {
    const uiEmitter = new GameEmitter();

    return uiEmitter;
  }
}

export default GameEmitter;

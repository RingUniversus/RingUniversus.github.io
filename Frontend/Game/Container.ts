import GameUIManager from "../../Backend/GameLogic/GameUIManager";
import * as scenes from "./Scenes";

export default class Container {
  private static instance: Container | null = null;

  div: HTMLDivElement;
  game: Phaser.Game;
  gameUIManager: GameUIManager;

  private constructor(
    div: HTMLDivElement,
    game: Phaser.Game,
    gameUIManager: GameUIManager
  ) {
    this.div = div;
    this.game = game;
    this.gameUIManager = gameUIManager;

    window.addEventListener("resize", this.resizeGame.bind(this));
    this.resizeGame();
  }

  static initialize(div: HTMLDivElement, gameUIManager: GameUIManager) {
    if (Container.instance !== null) {
      return Container.instance;
    }
    // Create Phaser game
    const config = {
      type: Phaser.WEBGL,
      parent: div,
      pixelArt: false,
      scene: [scenes.Main, scenes.UI],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.NO_CENTER,
        // mode: Phaser.Scale.RESIZE,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      dom: {
        createContainer: true,
        // behindCanvas: false,
      },
      disableContextMenu: true,
    };
    const game = new Phaser.Game(config);
    game.scene.start("MainScene", { gameUIManager: gameUIManager });
    game.domContainer.style.zIndex = "10";

    const container = new Container(div, game, gameUIManager);
    Container.instance = container;

    return container;
  }

  static destroy() {
    if (Container.instance) {
      window.removeEventListener(
        "resize",
        Container.instance.resizeGame.bind(this)
      );
      Container.instance.game.destroy(true);
    }
    Container.instance = null;
  }

  private resizeGame() {
    const width = this.div.clientWidth;
    const height = this.div.clientHeight;
    try {
      this.game.scale.resize(width, height);
    } catch (error) {
      // TODO: resize error, check how to fix later
      return;
    }
  }
}

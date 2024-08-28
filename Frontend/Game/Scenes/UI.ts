import GameUIManager from "../../../Backend/GameLogic/GameUIManager";
import CoordsPane from "../Objects/CoordsPane";
import UIMask from "../Objects/UIMask";

interface InitData {
  gameUIManager: GameUIManager;
}

export class UI extends Phaser.Scene {
  coordsPane: CoordsPane;
  gameUIManager: GameUIManager;

  constructor() {
    super({ key: "ui" });
  }

  init(data: InitData) {
    this.gameUIManager = data.gameUIManager;
  }

  create() {
    new UIMask(this);

    this.coordsPane = new CoordsPane(
      this,
      Number(this.gameUIManager!.getRingConfigs().constants.DISTANCE),
      Number(this.gameUIManager!.getRingConfigs().nextId)
    );

    const worldCamera = this.scene.get("MainScene").cameras.main;
    //  worldCamera.midPoint.x, worldCamera.midPoint.y
    this.input.on("pointermove", (pointer: MouseEvent) => {
      const pos = worldCamera.getWorldPoint(pointer.x, pointer.y);
      this.coordsPane.render(pos.x, pos.y);
    });
  }
}

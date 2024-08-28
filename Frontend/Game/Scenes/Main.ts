import Phaser from "phaser";
import GameUIManager from "../../../Backend/GameLogic/GameUIManager";
import LoadingManager from "../Objects/LoadingManager";
import Player from "../Objects/Player";
import RingsContainer from "../Objects/RingsContainer";
import { AddressLike } from "ethers";
import ActionMenu, { ActionGroup } from "../Objects/ActionMenu";
import TownsContainer from "../Objects/TownsContainer";
import GameEmitter, {
  GameEmitterEvent,
} from "../../../Frontend/Utils/GameEmitter";

interface InitData {
  gameUIManager: GameUIManager;
}

export class Main extends Phaser.Scene {
  started: boolean = false;
  gameUIManager!: GameUIManager;
  loadingManager!: LoadingManager;
  player: Player;

  private escKey: Phaser.Input.Keyboard.Key;

  actionMenu: ActionMenu | null = null;
  townsContainer: TownsContainer;
  ringsContainer: RingsContainer;
  isCameraDragging: boolean = false;
  gameEmitter: GameEmitter;

  constructor() {
    super({ key: "MainScene" });
  }

  init(data: InitData) {
    this.gameUIManager = data.gameUIManager;
    this.gameEmitter = this.gameUIManager.getGameEventEmitter();
    this.started = false;
  }

  preload() {
    this.loadingManager = new LoadingManager(this);

    this.load.on("progress", (value: number) => {
      console.log("progress: ", value);
    });

    this.load.on("complete", () => {
      console.log("complete: ");
      if (!this.started) {
        this.started = true;
        this.startGame();
      }
    });
  }

  startGame() {
    this.registerKeys();
    this.input.topOnly = false;

    this.ringsContainer = new RingsContainer(
      this,
      this.gameUIManager!.getRingInfo(),
      this.gameUIManager!.getRingConfigs()
    );
    this.add.existing(this.ringsContainer);

    this.townsContainer = new TownsContainer(
      this,
      this.gameUIManager!.getTownInfo()
    );
    this.add.existing(this.townsContainer);

    this.player = new Player(this, this.gameUIManager.getPlayer());
    this.add.existing(this.player);

    this.gameEmitter
      .on(
        GameEmitterEvent.PlayerUpdated,
        (address: AddressLike, isCurrentPlayer: boolean) => {
          if (isCurrentPlayer) this.player.setPlayer(this.getPlayer());
        }
      )
      .on(GameEmitterEvent.TownUpdated, (totalSupply: number) => {
        console.log("Town Update, ready to renderer.");
        this.townsContainer.setTowns(this.gameUIManager.getTownInfo());
      });
  }

  private getPlayer(address?: AddressLike) {
    return this.gameUIManager.getPlayer(address);
  }

  create() {
    const origin = this.add.circle(0, 0, 10, 0xffffff);
    // this.cameras.main.setBounds(0, 0, 2000, 2000);
    this.cameras.main.setZoom(1);
    const { x, y } = this.player.currentCoords();
    this.cameras.main.centerOn(x, y);
    // this.cameras.main.centerToBounds();

    const camera = this.cameras.main;
    let cameraDragStartX: number;
    let cameraDragStartY: number;

    this.escKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.escKey.on("down", () => {
      if (this.actionMenu) this.destoryActionMenu();
    });

    this.input.on("pointerdown", (_: Phaser.Input.Pointer) => {
      // if (this.actionMenu) this.destoryActionMenu();
      cameraDragStartX = camera.scrollX;
      cameraDragStartY = camera.scrollY;
    });

    this.input.on(
      "pointerup",
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: Phaser.GameObjects.GameObject[]
      ) => {
        if (!this.isCameraDragging) {
          let actions = [
            {
              name: "Move Here",
              type: ActionGroup.FunctionBtn,
              function: this.player.callMove,
            },
          ];
          gameObjects.map((v, _) => {
            actions = actions.concat(v.actions);
          });
          this.toggleActionMenu(pointer.worldX, pointer.worldY, actions);
        }
        this.isCameraDragging = false;
      }
    );

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.isCameraDragging = true;
        camera.scrollX =
          cameraDragStartX + (pointer.downX - pointer.x) / camera.zoom;
        camera.scrollY =
          cameraDragStartY + (pointer.downY - pointer.y) / camera.zoom;
      }
    });

    this.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: Phaser.GameObjects.GameObject[],
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        // Get the current world point under pointer.
        const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
        const newZoom = camera.zoom - camera.zoom * 0.001 * deltaY;
        camera.zoom = Phaser.Math.Clamp(newZoom, 0.025, 10);

        // Update camera matrix, so `getWorldPoint` returns zoom-adjusted coordinates.
        camera.preRender();

        const newWorldPoint = camera.getWorldPoint(pointer.x, pointer.y);
        // Scroll the camera to keep the pointer under the same world point.
        camera.scrollX -= newWorldPoint.x - worldPoint.x;
        camera.scrollY -= newWorldPoint.y - worldPoint.y;
      }
    );

    this.scene.launch("ui", { gameUIManager: this.gameUIManager });
  }

  private showActionMenu(x: number, y: number, actions: any) {
    if (!this.actionMenu) {
      this.actionMenu = new ActionMenu(this, x, y, this.gameUIManager, actions);
      this.add.existing(this.actionMenu);
    }
  }

  private destoryActionMenu() {
    if (this.actionMenu) {
      if (this.actionMenu.destroy()) {
        this.actionMenu = null;
      }
    }
  }

  private toggleActionMenu(x: number, y: number, actions: any) {
    if (this.actionMenu) this.destoryActionMenu();
    else this.showActionMenu(x, y, actions);
  }

  update() {
    // Update logic here
  }

  registerKeys() {
    // const preferences = loadPreferences();
    this.input.keyboard!.removeAllListeners();
    this.input.keyboard!.on("keydown-SPACE", () => {
      if (this.player) {
        const camera = this.cameras.main;
        const duration = 1000; // Duration of the camera movement in milliseconds

        this.tweens.add({
          targets: camera,
          scrollX: this.player.x - camera.width / 2,
          scrollY: this.player.y - camera.height / 2,
          duration: duration,
          ease: "Power2",
          // onUpdate: () => {
          //   // Optional: you can do something during the tween update
          // },
        });
      }
    });
  }
}

import { WorldCoords } from "../../../_types/ringuniversus/ContractsAPITypes";
import GameUIManager from "../../../Backend/GameLogic/GameUIManager";
import { ActionGroup } from "./ActionMenu";
import PlayerContainer from "./PlayerContainer";
import PlayerInfoPane from "./PlayerInfoPane";

enum MoveStatus {
  Idle,
  Moving,
  Exploring,
  Attacking,
}

function coordsAtRatio(
  startCoords: WorldCoords,
  endCoords: WorldCoords,
  ratio: number
): WorldCoords {
  if (ratio >= 1) {
    return endCoords;
  }

  // Calculate the difference in x and y coordinates
  const deltaX = endCoords.x - startCoords.x;
  const deltaY = endCoords.y - startCoords.y;

  // Calculate the coordinates at the given ratio
  const newX = startCoords.x + deltaX * ratio;
  const newY = startCoords.y + deltaY * ratio;

  // Return the new point
  return { x: newX, y: newY };
}

function currentCoords(player): WorldCoords {
  switch (player.info.status) {
    case MoveStatus.Idle:
      return {
        x: player.info.location.x,
        y: player.info.location.y,
      };
    case MoveStatus.Moving:
      const timeSpend = Date.now() / 1000 - player.moveInfo.startTime;
      const movedDistance = Number(
        (timeSpend * player.moveInfo.speed).toFixed(2)
      );
      if (movedDistance * 0.999 >= player.moveInfo.distance)
        return player.moveInfo.target;
      const movedRatio = movedDistance / player.moveInfo.distance;
      return coordsAtRatio(
        player.info.location,
        player.moveInfo.target,
        movedRatio
      );
    default:
      return {
        x: player.info.location.x,
        y: player.info.location.y,
      };
  }
}

export default class Player extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  private player: object;
  private pathGraphics: Phaser.GameObjects.Graphics;
  private dashedPathGraphics: Phaser.GameObjects.Graphics;
  private coordText: Phaser.GameObjects.DynamicBitmapText;
  private currentTween: Phaser.Tweens.Tween | null = null;
  private playerInfoPane: PlayerInfoPane | null = null;

  /**
   *
   */
  constructor(scene: Phaser.Scene, player: any) {
    const { x, y } = currentCoords(player);
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    this.setDepth(10);
    scene.add.existing(this);
    this.render(this.player);

    // Initialize graphics for path
    this.pathGraphics = this.scene.add.graphics({
      lineStyle: { width: 4, color: 0xff0000 },
    });
    this.scene.add.existing(this.pathGraphics);
    this.dashedPathGraphics = this.scene.add.graphics({
      lineStyle: { width: 4, color: 0xff0000 },
    });
    this.scene.add.existing(this.dashedPathGraphics);

    // Initialize text for coordinates
    this.coordText = this.scene.add.dynamicBitmapText(
      0,
      70,
      "cascadia",
      "(0, 0)",
      12
    );
    this.coordText.tintFill = true;

    this.coordText.setOrigin(0.5, 0); // Center the text horizontally
    this.add(this.coordText);

    // Initial update of coordinates
    this.updateCoordinates();
    this.updateStatus();

    this.setSize(130, 130); // Width and height of the interactive area
    this.setInteractive();
    // this.on(
    //   "pointerup",
    //   (pointer: Phaser.Input.Pointer) => {
    //     if (pointer.button === 0) {
    //       // 0 is the left mouse button
    //       this.onPlayerClicked(pointer);
    //     }
    //   },
    //   this
    // );
  }

  // public escDown() {
  //   if (this.playerInfoPane && this.playerInfoPane.pin) return;
  //   this.destoryPlayerInfoPane();
  // }

  // private onPlayerClicked(pointer: Phaser.Input.Pointer) {
  //   if (this.playerInfoPane && this.playerInfoPane.pin) return;
  //   this.destoryPlayerInfoPane();

  //   // open PlayerInfoPane when the player is clicked
  //   this.playerInfoPane = new PlayerInfoPane(
  //     this,
  //     pointer.worldX,
  //     pointer.worldY
  //   );
  //   this.scene.add.existing(this.playerInfoPane);
  // }

  public stopMoving(x: number, y: number, gameUIManager: GameUIManager) {
    return gameUIManager.playerStopMoving();
  }

  public claimRewards(x: number, y: number, gameUIManager: GameUIManager) {
    return gameUIManager.playerClaimRewards();
  }

  private destoryPlayerInfoPane() {
    if (this.playerInfoPane) {
      this.playerInfoPane.destroy();
      this.playerInfoPane = null;
    }
  }

  public currentCoords() {
    return currentCoords(this.player);
  }

  public get playerInstance() {
    return this.player;
  }

  public setPlayer(player: object) {
    this.player = player;
    this.updateStatus();
    // this.setPosition(this.player.info.location.x, this.player.info.location.y);
  }

  private updateStatus() {
    switch (this.player.info.status) {
      case MoveStatus.Idle:
        // If idle, possibly clear paths or set up for the next action
        this.pathGraphics.clear();
        this.dashedPathGraphics.clear();
        this.drawPath(
          this.x,
          this.y,
          this.player.moveInfo.target.x,
          this.player.moveInfo.target.y
        );

        break;
      case MoveStatus.Moving:
        const actualSpentTime = Math.round(
          Date.now() / 1000 - this.player.moveInfo.startTime
        );
        if (actualSpentTime * 0.999 >= this.player.moveInfo.spendTime) {
          this.setPosition(
            this.player.moveInfo.target.x,
            this.player.moveInfo.target.y
          );
          this.drawPath(
            this.x,
            this.y,
            this.player.moveInfo.target.x,
            this.player.moveInfo.target.y
          );
          break;
        }

        const currentCoords = this.currentCoords();
        const targetCoords = this.player.moveInfo.target;
        this.drawPath(this.x, this.y, targetCoords.x, targetCoords.y);
        // console.log("CT: ", currentCoords, targetCoords);

        // Only call moveToTarget if the current position is different from the target
        if (
          currentCoords.x !== targetCoords.x ||
          currentCoords.y !== targetCoords.y
        ) {
          this.moveToTarget(targetCoords.x, targetCoords.y, actualSpentTime);
        }
        break;

      default:
        break;
    }
  }

  private render(player: object) {
    this.removeAll(true);

    this.add(new PlayerContainer(this.scene, 0, 0, player));
  }

  public callMove(x: number, y: number, gameUIManager: GameUIManager) {
    console.log("Player plan move to:", x, y);
    gameUIManager.playerMoveToTarget(x, y);
  }

  /**
   * Moves the Player to the specified coordinates.
   * @param x The target x coordinate.
   * @param y The target y coordinate.
   * @param speed The movement speed in pixels per second.
   */
  private moveToTarget(x: number, y: number, actualSpentTime: number) {
    // If there is an ongoing tween, stop it
    if (this.currentTween) {
      this.currentTween.stop(); // Stop the current tween
      this.pathGraphics.clear();
      this.dashedPathGraphics.clear();
    }

    const duration = (this.player.moveInfo.spendTime - actualSpentTime) * 1000;

    // Draw the path from the current position to the target position.

    // Create a new tween to move the Player to the target position
    this.currentTween = this.scene.tweens.add({
      targets: this,
      x: x,
      y: y,
      duration: duration,
      ease: "Linear",
      onUpdate: () => {
        // Update the path as the player moves
        this.drawPath(this.x, this.y, x, y);
        this.updateCoordinates();
      },
      onComplete: () => {
        // Clear the path after reaching the target
        // this.pathGraphics.clear();
        // Reset currentTween to null when the animation completes
        this.currentTween = null;
      },
    });
  }

  /**
   * Draws a path from the starting point to the target point.
   * @param startX The starting x coordinate.
   * @param startY The starting y coordinate.
   * @param targetX The target x coordinate.
   * @param targetY The target y coordinate.
   */
  private drawPath(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number
  ) {
    this.pathGraphics.clear(); // Clear previous path
    this.pathGraphics.lineBetween(startX, startY, targetX, targetY); // Draw the line

    this.drawDashedPath(
      this.player.moveInfo.start.x,
      this.player.moveInfo.start.y,
      this.player.moveInfo.target.x,
      this.player.moveInfo.target.y
    );
  }

  /**
   * Draws a dashed path from the starting point to the target point.
   * @param startX The starting x coordinate.
   * @param startY The starting y coordinate.
   * @param targetX The target x coordinate.
   * @param targetY The target y coordinate.
   */
  private drawDashedPath(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number
  ) {
    this.dashedPathGraphics.clear(); // Clear previous path

    const dashLength = 10; // Length of each dash
    const gapLength = 5; // Length of the gap between dashes

    const lineLength = Phaser.Math.Distance.Between(
      startX,
      startY,
      targetX,
      targetY
    );
    const numDashes = Math.floor(lineLength / (dashLength + gapLength));

    const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);

    for (let i = 0; i < numDashes; i++) {
      const x1 = startX + i * (dashLength + gapLength) * Math.cos(angle);
      const y1 = startY + i * (dashLength + gapLength) * Math.sin(angle);
      const x2 = x1 + dashLength * Math.cos(angle);
      const y2 = y1 + dashLength * Math.sin(angle);

      this.dashedPathGraphics.lineBetween(x1, y1, x2, y2);
    }
  }

  private updateCoordinates() {
    this.coordText.setText(`(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`);
  }

  public get actions() {
    let actions = [];
    if (this.player.isCurrentPlayer) {
      if (this.player.info.status === 1) {
        actions.push({
          name: "Stop Moving",
          type: ActionGroup.FunctionBtn,
          function: this.stopMoving,
        });
      }
      if (
        this.player.info.status === 0 &&
        !this.player.moveInfo.isClaimed &&
        this.player.moveInfo.endTime
      ) {
        actions.push({
          name: "Claim Rewards",
          type: ActionGroup.FunctionBtn,
          function: this.claimRewards,
        });
      }
    }
    if (actions.length > 0) {
      actions = [
        ...[
          {
            name: "Player Actions: ",
            type: ActionGroup.Divider,
          },
        ],
        ...actions,
      ];
    }
    return actions;
  }
}

import GameUIManager from "../../../Backend/GameLogic/GameUIManager";
import { ActionGroup } from "./ActionMenu";

export default class TownContainer extends Phaser.GameObjects.Container {
  circle: Phaser.Geom.Circle;
  rotationTween: Phaser.Tweens.Tween;
  textContainer: Phaser.GameObjects.Container;
  nameRing: Phaser.Geom.Circle;
  avatar: Phaser.GameObjects.Image;
  town: any;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    index: number,
    town: any
  ) {
    super(scene, x, y);

    this.scene = scene;
    this.town = town;

    const ringRadius = 60;
    this.nameRing = new Phaser.Geom.Circle(x, y, ringRadius);
    this.nameRing.setPosition(x, y);

    this.avatar = this.scene.add.image(0, 0, "defaultSpaceStation");
    this.avatar.setDisplaySize(ringRadius - 10, ringRadius - 10);
    this.add(this.avatar);

    // Create a container for the text
    this.textContainer = this.scene.add.container();
    this.add(this.textContainer); // Add the text container to the PlayerContainer

    this.createTownNameText(town.nickname, 40);

    this.setSize(130, 130); // Width and height of the interactive area
    this.setInteractive();
  }

  private createTownNameText(nickname: string, radius: number) {
    const circumference = 2 * Math.PI * radius;
    const borderText = ` ${nickname} `;

    const charWidth = 12;
    const numChars = borderText.length;
    const angleStep = (2 * Math.PI) / (circumference / charWidth);

    for (let i = 0; i < numChars; i++) {
      const char = borderText[i];
      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const charObj = this.scene.add.dynamicBitmapText(
        x,
        y,
        "cascadia",
        char,
        10
      );
      charObj.tintFill = true;
      charObj.setOrigin(0.5, 0.5);
      charObj.setAngle(Phaser.Math.RadToDeg(angle) + 90);
      this.textContainer.add(charObj);
    }

    this.scene.tweens.add({
      targets: this.textContainer,
      angle: 360,
      duration: 20000,
      ease: "Linear",
      repeat: -1,
    });
  }

  private teleport(x: number, y: number, gameUIManager: GameUIManager) {
    // console.log("this.town: ", this.town);
    console.log("gameUIManager: ", gameUIManager);
    return gameUIManager.teleportToTown(0, 1);
  }

  public get actions() {
    return [
      {
        name: `${this.town.nickname} Actions: `,
        type: ActionGroup.Divider,
      },
      {
        name: `Teleport`,
        type: ActionGroup.FunctionBtn,
        function: this.teleport,
      },
    ];
  }
}

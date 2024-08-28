export default class PlayerContainer extends Phaser.GameObjects.Container {
  nameRing: Phaser.Geom.Circle;
  avatar: Phaser.GameObjects.Image;
  rotationTween: Phaser.Tweens.Tween;
  textContainer: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number, player: any) {
    super(scene, x, y);

    this.scene = scene;
    const ringRadius = 60;

    this.nameRing = new Phaser.Geom.Circle(x, y, ringRadius);
    this.nameRing.setPosition(x, y);

    // const graphics = this.scene.add.graphics({
    //   lineStyle: { color: 0xbfc0c0, width: 10, alpha: 0.1 },
    // });
    // graphics.strokeCircleShape(this.nameRing);
    // this.add(graphics);

    console.log("player.info.avatar: ", player.info.avatar || "defaultAvatar");
    this.avatar = this.scene.add.image(
      0,
      0,
      player.info.avatar || "defaultAvatar"
    );
    this.avatar.setDisplaySize(ringRadius - 10, ringRadius - 10);
    this.add(this.avatar);

    // Create a container for the text
    this.textContainer = this.scene.add.container();
    this.add(this.textContainer); // Add the text container to the PlayerContainer

    this.createPlayerNameText(player.info.nickname, 60);
  }

  private createPlayerNameText(nickname: string, radius: number) {
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
}

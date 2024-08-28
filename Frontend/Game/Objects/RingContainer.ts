export default class RingContainer extends Phaser.GameObjects.Container {
  circle: Phaser.Geom.Circle;
  rotationTween: Phaser.Tweens.Tween;
  textContainer: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    index: number,
    ring: any,
    radius: BigInt
  ) {
    super(scene, x, y);

    this.scene = scene;

    this.circle = new Phaser.Geom.Circle(0, 0, (index + 1) * Number(radius));
    this.circle.setPosition(x, y);

    const graphics = this.scene.add.graphics({
      lineStyle: { color: 0xbfc0c0, width: 40, alpha: 0.1 },
    });
    graphics.strokeCircleShape(this.circle);
    this.add(graphics); // Ensure graphics are added to the container first

    // Create a container for the text
    this.textContainer = this.scene.add.container();
    this.add(this.textContainer); // Add the text container

    this.createTextRing(index, ring, (index + 1) * Number(radius));
  }

  private createTextRing(index: number, ring: any, radius: Number) {
    const circumference = 2 * Math.PI * Number(radius);
    // console.log("ring.explorer: ", ring);
    const borderText = `Ring Universus Ring #${index
      .toString()
      .padStart(4, "0")} Mint By ${ring.explorer} ·`;

    const charWidth = 12; // Approximate width of each character
    const numChars = borderText.length;
    const angleStep = (2 * Math.PI) / (circumference / charWidth);

    for (let i = 0; i < numChars; i++) {
      const char = borderText[i];
      const angle = i * angleStep;
      const x = Number(radius) * Math.cos(angle);
      const y = Number(radius) * Math.sin(angle);

      const charObj = this.scene.add.dynamicBitmapText(
        x,
        y,
        "cascadia",
        char,
        20
      );
      charObj.tintFill = true;
      charObj.setOrigin(0.5, 0.5);
      charObj.setAngle(Phaser.Math.RadToDeg(angle) + 90);
      this.textContainer.add(charObj);
    }

    this.scene.tweens.add({
      targets: this.textContainer,
      angle: 360 * (index % 2 ? 1 : -1),
      duration: 500000 + index * 100000,
      ease: "Linear",
      repeat: -1,
    });
  }

  private handlePointerOver() {
    this.rotationTween.pause();
  }

  private handlePointerOut() {
    this.rotationTween.resume();
  }
}

import RingContainer from "./RingContainer";

export default class RingsContainer extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  config: object;

  /**
   *
   */
  constructor(scene: Phaser.Scene, rings: Map<number, object>, config: object) {
    super(scene, 0, 0);

    this.scene = scene;
    this.config = config;

    this.setDepth(-1);
    scene.add.existing(this);
    this.render(rings);
  }

  private render(rings: Map<number, object>) {
    this.removeAll(true);

    rings.forEach((v, k) => {
      // console.log("rings.forEach: ", k, v);
      this.add(
        new RingContainer(
          this.scene,
          0,
          0,
          k,
          v,
          this.config.constants.DISTANCE
        )
      );
    });
  }
}

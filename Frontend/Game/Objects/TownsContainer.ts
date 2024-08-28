import TownContainer from "./TowContainer";

export default class TownsContainer extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  towns: Map<number, object>;

  /**
   *
   */
  constructor(scene: Phaser.Scene, towns: Map<number, object>) {
    super(scene, 0, 0);

    this.scene = scene;

    this.towns = towns;
    this.setDepth(-1);
    scene.add.existing(this);
    this.render();
  }

  public setTowns(towns: Map<number, object>) {
    this.towns = towns;
    this.render();
  }

  private render() {
    this.removeAll(true);

    this.towns.forEach((v, k) => {
      // console.log("towns.forEach: ", k, v);
      this.add(new TownContainer(this.scene, v.location.x, v.location.y, k, v));
    });
  }
}

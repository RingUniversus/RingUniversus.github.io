export default class LoadingManager {
  scene: Phaser.Scene;
  loadingBar: Phaser.GameObjects.Container | null = null;
  statusMessage: string;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.statusMessage = "loading";

    this.scene.load.on(
      "fileprogress",
      (file: Phaser.Loader.File, percentComplete: number) => {
        if (percentComplete < 1) {
          this.statusMessage = "loading_asset" + " " + file.key;
        }
      }
    );

    this.scene.load.on("complete", () => {
      this.statusMessage = "loading_complete";
    });

    this.preload();
  }

  async preload() {
    const scene = this.scene;
    scene.load.bitmapFont(
      "cascadia",
      "assets/fonts/CascadiaCode.png",
      "assets/fonts/CascadiaCode.xml"
    );
    scene.load.svg({
      key: "defaultAvatar",
      url: "assets/images/DefaultAvatar.svg",
      svgConfig: { width: 300, height: 300 },
    });
    scene.load.svg({
      key: "defaultSpaceStation",
      url: "assets/images/DefaultAnimatedSpaceStation.svg",
      svgConfig: { width: 300, height: 300 },
    });
  }
}

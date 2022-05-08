export class Preloader extends Phaser.Scene {
  constructor() {
    super({
      key: "preloader",
    });
  }

  init() {}

  //preload all assets
  preload() {
    // Load in images and sprites
    this.load.image("ship", "assets/img/ship2.png");
    this.load.image("enemy", "assets/img/enemyship.png");
    this.load.image("star1", "assets/img/star.png");
    this.load.image("bug", "assets/img/bug.png");
    this.load.image("base", "assets/img/Mothership.png");
    this.load.image("bullet", "assets/img/lase1.png");
    this.load.image("playbutton", "assets/img/play.png");
    this.load.image("bulletenemy", "assets/img/lase3.png");
    this.load.image("target", "assets/img/crossair.png");
    this.load.image("backgroundpedras", "assets/img/pedras.png");
    this.load.image("background", "assets/img/sky.jpg");

    this.load.bitmapFont(
      "arcade",
      "assets/input/arcade.png",
      "assets/input/arcade.xml"
    );

    this.load.audio("shot", "assets/audio/shot.mp3");
  }

  create() {
    this.scene.start("mainmenu");
  }
}

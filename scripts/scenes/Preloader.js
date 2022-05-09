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
    this.load.image("helpButton", "assets/img/helpButton.png");
    this.load.image("background", "assets/img/sky.jpg");
    this.load.image("goBack", "assets/img/goBack.png");
    this.load.image("heart", "assets/img/heart.webp");
    this.load.image("boss", "assets/img/ship.gif");
    this.load.image("shotboss", "assets/img/shotBoss.png");

    //Font
    this.load.bitmapFont(
      "arcade",
      "assets/input/arcade.png",
      "assets/input/arcade.xml"
    );

    //audio
    this.load.audio("shot", "assets/audio/shot.mp3");
    this.load.audio("levelUp", "assets/audio/levelUp.mp3");
    this.load.audio("menuSound", "assets/audio/menu_sound.mp3");
    this.load.audio("gameSound", "assets/audio/gamesound.mp3");
    this.load.audio("shotTaken", "assets/audio/explosion_sound.mp3");
    this.load.audio("powerSound", "assets/audio/powerSound.mp3");
  }

  create() {
    //start another scene
    this.scene.start("mainmenu");
  }
}

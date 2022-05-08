let height = window.innerHeight;
let width = window.innerWidth;
let isCreated = false;
export class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "mainmenu" });
  }

  create() {
    if (!isCreated) {
      isCreated = true;
      this.sound.play("menuSound", {
        loop: true,
      });
    }

    var title = this.add
      .bitmapText(width * 0.25, 100, "arcade", "Welcome to Space Defense")
      .setTint(0xff00ff);

    var madeBy = this.add
      .bitmapText(
        width / 3,
        height - 50,
        "arcade",
        "Made By: Joao Sencadas N_20381 & Ruben Morim N_20399",
        10
      )
      .setTint(0xff00ff);

    //Efeito no texto
    this.tweens.add({
      targets: title,
      y: 150,
      duration: 5000,
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: madeBy,
      y: height - 100,
      duration: 5000,
      yoyo: true,
      repeat: -1,
    });

    var playButton = this.add.image(width / 2, height / 2, "playbutton");
    playButton.setOrigin(0.5, 0.5).setDisplaySize(200, 200);

    playButton.setInteractive();

    playButton.once(
      "pointerup",
      function () {
        this.scene.start("game");
        this.sound.stopAll();
      },
      this
    );

    var helpButton = this.add.image(width / 1.5, height - 200, "helpButton");
    helpButton.setOrigin(0.5, 0.5).setDisplaySize(52, 52);

    helpButton.setInteractive();

    helpButton.once(
      "pointerup",
      function () {
        this.scene.start("help");
      },
      this
    );
  }
}

let height = window.innerHeight;
let width = window.innerWidth;

export class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "mainmenu" });
  }

  create() {
    var title = this.add
      .bitmapText(width / 4.3, 100, "arcade", "Welcome to Space Defense")
      .setTint(0xff00ff);

    var madeBy = this.add
      .bitmapText(
        width / 3,
        500,
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
      y: 550,
      duration: 5000,
      yoyo: true,
      repeat: -1,
    });

    var bg = this.add.image(width / 2, height / 2, "playbutton");
    bg.setOrigin(0.5, 0.5).setDisplaySize(200, 200);

    bg.setInteractive();

    bg.once(
      "pointerup",
      function () {
        this.scene.start("game");
      },
      this
    );
  }
}

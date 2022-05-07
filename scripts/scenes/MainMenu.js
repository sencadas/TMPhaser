export class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "mainmenu" });
  }

  create() {
    var title = this.add
      .bitmapText(20, 200, "arcade", "Welcome to Space Defense")
      .setTint(0xff00ff);

    this.tweens.add({
      targets: title,
      y: 220,
      duration: 5000,
      yoyo: true,
      repeat: -1,
    });

    var bg = this.add.image(400, 400, "playbutton");
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

export class Pause extends Phaser.Scene {
  constructor() {
    super({ key: "pause" });
  }

  create() {
    var title = this.add
      .bitmapText(20, 200, "arcade", "Pause")
      .setTint(0xff00ff);

    this.tweens.add({
      targets: title,
      y: 220,
      duration: 5000,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard.on(
      "keydown-P",
      function () {
        this.scene.resume("game");
        this.scene.stop();
      },
      this
    );
  }
}

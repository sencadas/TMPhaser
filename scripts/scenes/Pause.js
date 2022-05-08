let height = window.innerHeight;
let width = window.innerWidth;
export class Pause extends Phaser.Scene {
  constructor() {
    super({ key: "pause" });
  }

  create() {
    var title = this.add
      .bitmapText(width / 1.9, 100, "arcade", "Pause")
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

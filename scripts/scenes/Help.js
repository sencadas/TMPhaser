let height = window.innerHeight;
let width = window.innerWidth;

//classe que represente a secção de help
export class Help extends Phaser.Scene {
  constructor() {
    super({ key: "help" });
  }

  create() {
    this.add
      .bitmapText(width / 3, 50, "arcade", "HOW TO PLAY", 50)
      .setTint(0x969cd9);

    this.add
      .bitmapText(
        width / 3,
        150,
        "arcade",
        "OBJECTIVE:\nSearch and Kill all the Monsters of the \nWave and try to Reach the maximum Score!\n\nThe game ends when your ship dies.\n",
        14
      )
      .setTint(0xc1c6f5);

    this.add
      .bitmapText(
        width / 3,
        240,
        "arcade",
        "Game Keys:\n\nQ-E to zoom in and out the map\nW-A-S-D to fly the ship \nMouse1 to shoot the enemies\nP to pause the game\nR to user super power",
        14
      )
      .setTint(0xff00ff);

    var goBack = this.add.image(width / 2.5, height - 140, "goBack");

    goBack.setOrigin(0.5, 0.5).setDisplaySize(70, 70);

    goBack.setInteractive();

    goBack.once(
      "pointerup",
      function () {
        this.scene.start("mainmenu");
      },
      this
    );
  }
}

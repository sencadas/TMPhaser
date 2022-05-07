export class Highscore extends Phaser.Scene {
  constructor() {
    super({ key: "Highscore" });

    var playerText;
  }

  init(data) {
    this.score = data;
  }

  preload() {
    this.load.image("block", "assets/input/block.png");
    this.load.image("rub", "assets/input/rub.png");
    this.load.image("end", "assets/input/end.png");

    //this.load.bitmapFont('arcade', 'assets/input/arcade.png', 'assets/input/arcade.xml');
  }

  create() {
    this.add
      .bitmapText(100, 260, "arcade", "RANK  SCORE   NAME")
      .setTint(0xff00ff);
    this.add
      .bitmapText(100, 310, "arcade", "1ST   " + this.score)
      .setTint(0xff0000);

    this.playerText = this.add
      .bitmapText(580, 310, "arcade", "")
      .setTint(0xff0000);

    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false;

    this.scene.launch("InputPanel");

    let panel = this.scene.get("InputPanel");

    //  Listen to events from the Input Panel scene
    panel.events.on("updateName", this.updateName, this);
    panel.events.on("submitName", this.submitName, this);
  }

  submitName() {
    this.scene.stop("InputPanel");

    this.add.bitmapText(100, 160, "arcade", "Leader board:").setTint(0xff00ff);

    this.add
      .bitmapText(100, 360, "arcade", "2ND   20       ANT")
      .setTint(0xff8200);
    this.add
      .bitmapText(100, 410, "arcade", "3RD   15       .-.")
      .setTint(0xffff00);
    this.add
      .bitmapText(100, 460, "arcade", "4TH   12       BOB")
      .setTint(0x00ff00);
    this.add
      .bitmapText(100, 510, "arcade", "5TH   8        ZIK")
      .setTint(0x00bfff);

    this.input.once(
      "pointerup",
      function (event) {
        this.scene.start("mainmenu");
      },
      this
    );
  }

  updateName(name) {
    this.playerText.setText(name);
  }
}

import { Preloader } from "./scenes/Preloader.js";
import { MainMenu } from "./scenes/MainMenu.js";
import { Game } from "./scenes/Game.js";
import { Starfield } from "./scenes/Starfield.js";
import { Highscore } from "./scenes/Highscore.js";
import { InputPanel } from "./scenes/InputPanel.js";

let config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Preloader, MainMenu, Game, Starfield, Highscore, InputPanel],
};

let game = new Phaser.Game(config);

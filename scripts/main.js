import { Preloader } from "./scenes/Preloader.js";
import { MainMenu } from "./scenes/MainMenu.js";
import { Game } from "./scenes/Game.js";
import { Starfield } from "./scenes/Starfield.js";
import { Highscore } from "./scenes/Highscore.js";
import { InputPanel } from "./scenes/InputPanel.js";

//actual window size
let height = window.innerHeight;
let width = window.innerWidth;

let config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: width,
  height: height,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Preloader, MainMenu, Game, Starfield, Highscore, InputPanel],
};

let game = new Phaser.Game(config);

import { Bullet } from "../classes/Bullet.js";
import { Bulletenemy } from "../classes/Bulletenemy.js";

var score = 0;
var gold = 0;
var spriteBounds;
var bugs = new Array();
var scoreText;
var counter = 0;
var wavebugs;
var waveenemy;
var wavestars;
var bullethit;
var mothership;
var player = null;
var enemy = null;
var star = null;
var healthpoints = null;
var reticle = null;
var moveKeys = null;
var playerBullets = null;
var enemyBullets = null;
var playerText;
var mothershiphealth;
var playerhealth;
var hp1;
var hp2;
var hp3;
var hp4;
var hp5;

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });

    this.controls;
    this.track;
    this.text;
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(-400, -400, 2500, 1900);
    //this.physics.world.setBounds(0, 0, 1600, 1200);

    // Add 2 groups for Bullet objects
    playerBullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    enemyBullets = this.physics.add.group({
      classType: Bulletenemy,
      runChildUpdate: true,
    });

    score = 0;
    gold = 1000;

    spriteBounds = Phaser.Geom.Rectangle.Inflate(
      Phaser.Geom.Rectangle.Clone(this.physics.world.bounds),
      -100,
      -100
    );

    // Add background player, enemy, reticle, healthpoint sprites
    var background2 = this.add.image(800, 600, "background");
    var background = this.add.image(800, 600, "backgroundpedras");

    var shot = this.sound.add("shot");

    player = this.physics.add.image(400, -400, "ship");
    reticle = this.physics.add.image(400, -400, "target");
    mothership = this.physics.add.image(800, 700, "base");
    enemy = this;
    hp1 = this.add.image(-350, -250, "target").setScrollFactor(0, 0);
    hp2 = this.add.image(-300, -250, "target").setScrollFactor(0, 0);
    hp3 = this.add.image(-250, -250, "target").setScrollFactor(0, 0);
    hp4 = this.add.image(-200, -250, "target").setScrollFactor(0, 0);
    hp5 = this.add.image(-150, -250, "target").setScrollFactor(0, 0);

    // Set image/sprite properties
    background2.setOrigin(0.5, 0.5).setDisplaySize(3600, 3200);
    background.setOrigin(0.5, 0.5).setDisplaySize(2600, 2200);
    mothership
      .setOrigin(0.5, 0.5)
      .setDisplaySize(600, 400)
      .setCollideWorldBounds(true);
    wavestars = this.time.addEvent({
      delay: 40000,
      callback: this.createstars,
      callbackScope: this,
      loop: true,
    });
    waveenemy = this.time.addEvent({
      delay: 30000 + score * 4,
      callback: this.createenemy,
      callbackScope: this,
      loop: true,
    });
    wavebugs = this.time.addEvent({
      delay: 20000 + score * 4,
      callback: this.createbugs,
      callbackScope: this,
      loop: true,
    });
    player
      .setOrigin(0.5, 0.5)
      .setDisplaySize(132, 120)
      .setCollideWorldBounds(true)
      .setDrag(500, 500);

    reticle
      .setOrigin(0.5, 0.5)
      .setDisplaySize(25, 25)
      .setCollideWorldBounds(false);
    hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp4.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    hp5.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

    //pedras com yoyo
    this.tweens.add({
      targets: background,
      y: this.game.config.height / 2 + 200,
      duration: 5000,
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: mothership,
      y: this.game.config.height / 2 + 200,
      duration: 5000,
      yoyo: true,
      repeat: -1,
    });

    player.health = 10;
    mothership.health = 40;

    // Set camera properties
    this.cameras.main.zoom = 0.5;
    this.cameras.main.startFollow(player);

    // Creates object for input with WASD kets
    moveKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Fires bullet from player on left click of mouse
    this.input.on(
      "pointerdown",
      function (pointer, time, lastFired) {
        if (player.active === false) return;
        shot.play();
        // Get bullet from bullets group
        bullethit = playerBullets.get().setActive(true).setVisible(true);

        if (bullethit) {
          bullethit.fire(player, reticle);
          this.physics.add.collider(enemy, bullethit, this.enemyHitCallback);

          this.physics.add.overlap(bugs, bullethit, this.killbugs);
        }
      },
      this
    );

    // Pointer lock will only work after mousedown
    this.game.input.mouse.requestPointerLock();

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on(
      "keydown_Q",
      function (event) {
        if (game.input.mouse.locked) game.input.mouse.releasePointerLock();
      },
      0,
      this
    );

    // Move reticle upon locked pointer move
    this.input.on(
      "pointermove",
      function (pointer) {
        if (this.input.mouse.locked) {
          reticle.x += pointer.movementX;
          reticle.y += pointer.movementY;
        }
      },
      this
    );

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 1.0,
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
      controlConfig
    );

    this.add
      .bitmapText(
        -300,
        -800,
        "arcade",
        "Who to play:\n\nDefende the base from the bugs\nQ-E to zoom in and out\nW-A-S-D to fly the ship \nMouse1 to shoot the enemies\nThe game ends when your ship or the base dies."
      )
      .setTint(0x00ff00);
    scoreText = this.add
      .bitmapText(-220, -200, "arcade", "Score: 0")
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);
    mothershiphealth = this.add
      .bitmapText(500, -270, "arcade", "Base health: 50")
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);
    playerhealth = this.add
      .bitmapText(-50, -270, "arcade", "10")
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);
  }

  createbugs() {
    for (var i = 0; i < 5 + score / 2; i++) {
      const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

      bugs[i] = this.physics.add.image(pos.x, pos.y, "bug").setScale(0.2);
      bugs[i].name = "bug" + i;

      bugs[i].setVelocity(
        Phaser.Math.Between(100, 300) + score,
        Phaser.Math.Between(100, 300) + score
      );
      bugs[i].setBounce(1).setCollideWorldBounds(true);
      bugs[i].health = 1;

      if (Math.random() > 0.5) {
        bugs[i].body.velocity.x *= -1;
      } else {
        bugs[i].body.velocity.y *= -1;
      }

      this.physics.add.collider(player, bugs[i], this.playerHitCallback);
      this.physics.add.overlap(mothership, bugs[i], this.damageBase);
      this.physics.add.collider(bugs[i], bullethit, this.killbugs);
    }
  }
  createenemy() {
    const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

    enemy = this.physics.add.image(pos.x, pos.y, "enemy");
    enemy
      .setOrigin(0.5, 0.5)
      .setDisplaySize(132 + score, 120 + score)
      .setCollideWorldBounds(true);

    enemy.health = 3 + score / 4;
    enemy.lastFired = 0;
  }

  createstars() {
    const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

    star = this.physics.add.image(pos.x, pos.y, "star1");
    star.setOrigin(0.5, 0.5).setDisplaySize(50, 50).setCollideWorldBounds(true);

    this.physics.add.overlap(player, star, this.buffs);
  }

  enemyHitCallback(enemyHit, bulletHit) {
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true) {
      enemyHit.health = enemyHit.health - 1;

      // Kill enemy if health <= 0
      if (enemyHit.health <= 0) {
        score = score + 3;
        scoreText.setText("Score: " + score);
        enemyHit.destroy();
      }

      // Destroy bullet
      bulletHit.destroy();
    }
  }

  killbugs(bug, bulletHit) {
    // Reduce health of enemy

    bug.health = bug.health - 1;

    score++;
    scoreText.setText("Score: " + score);
    bug.destroy();

    // Destroy bullet
    bulletHit.destroy();
  }

  buffs(player, star) {
    // Reduce health of enemy

    player.health = player.health + 3;
    mothership.health = mothership.health + 5;

    mothershiphealth.setText("Base health: " + mothership.health);
    playerhealth.setText(player.health);
    star.destroy();
  }

  damageBase(playerHit, bulletHit) {
    // Reduce health of player
    if (bulletHit.active === true && playerHit.active === true) {
      playerHit.health = playerHit.health - 1;
      score--;
      scoreText.setText("Score: " + score);
      mothershiphealth.setText("Base health: " + mothership.health);

      bulletHit.destroy();
    }
  }

  playerHitCallback(playerHit, bulletHit) {
    // Reduce health of player
    if (bulletHit.active === true && playerHit.active === true) {
      playerHit.health = playerHit.health - 1;

      // Kill hp sprites and kill player if health <= 0
      if (playerHit.health == 8) {
        hp5.destroy();
      } else if (playerHit.health == 6) {
        hp4.destroy();
      } else if (playerHit.health == 4) {
        hp3.destroy();
      } else if (playerHit.health == 2) {
        hp2.destroy();
      } else if (playerHit.health == 0) {
        hp1.destroy();
      }

      playerhealth.setText(player.health);
      // Destroy bullet
      //bulletHit.setActive(false).setVisible(false);
      bulletHit.body.gameObject.setTint(0xff0000);
      //this.time.addEvent({ delay: 300, callback: bulletHit, callbackScope: destroy() });
      bulletHit.destroy();
    }
  }

  enemyFire(enemy, player, time, gameObject) {
    if (enemy.active === false) {
      return;
    }

    if (time - enemy.lastFired > 1000) {
      enemy.lastFired = time;

      // Get bullet from bullets group
      var bullet = enemyBullets.get().setActive(true).setVisible(true);

      if (bullet) {
        bullet.fire(enemy, player);
        // Add collider between bullet and player
        gameObject.physics.add.collider(player, bullet, this.playerHitCallback);
      }
    }
  }

  // Ensures sprite speed doesnt exceed maxVelocity while update is called
  constrainVelocity(sprite, maxVelocity) {
    if (!sprite || !sprite.body) return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * maxVelocity;
      vy = Math.sin(angle) * maxVelocity;
      sprite.body.velocity.x = vx;
      sprite.body.velocity.y = vy;
    }
  }

  // Ensures reticle does not move offscreen
  constrainReticle(reticle) {
    var distX = reticle.x - player.x; // X distance between player & reticle
    var distY = reticle.y - player.y; // Y distance between player & reticle

    // Ensures reticle cannot be moved offscreen (player follow)
    if (distX > 800) reticle.x = player.x + 800;
    else if (distX < -800) reticle.x = player.x - 800;

    if (distY > 600) reticle.y = player.y + 600;
    else if (distY < -600) reticle.y = player.y - 600;
  }

  update(time, delta) {
    if (moveKeys["left"].isDown) player.x -= 10;
    if (moveKeys["right"].isDown) player.x += 10;

    if (moveKeys["up"].isDown) player.y -= 10;
    if (moveKeys["down"].isDown) player.y += 10;

    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(
      player.x,
      player.y,
      reticle.x,
      reticle.y
    );

    // Rotates enemy to face towards player
    if (enemy != null)
      enemy.rotation = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        player.x,
        player.y
      );

    //Make reticle move with player
    reticle.body.velocity.x = player.body.velocity.x;
    reticle.body.velocity.y = player.body.velocity.y;

    // Constrain velocity of player
    this.constrainVelocity(player, 500);

    // Constrain position of constrainReticle
    this.constrainReticle(reticle);

    // Make enemy fire
    this.enemyFire(enemy, player, time, this);

    if (player.health <= 0 || mothership.health <= 0)
      this.scene.start("Highscore", score);

    this.controls.update(delta);
  }
}

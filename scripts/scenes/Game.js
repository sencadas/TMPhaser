import { Bullet } from "../classes/Bullet.js";
import { Bulletenemy } from "../classes/Bulletenemy.js";
import { BulletBoss } from "../classes/BossBullet.js";

let height = window.innerHeight;
let width = window.innerWidth;

//game settings
var spriteBounds;
var reticle = null;
var bullethit;
var moveKeys = null;

//wave Control
var currentEnemies = 0;
var currentWave = 0;

//text display
var superPowerText;
var playerhealth;
var bulletPowerText;
var scoreText;

//geral state
var score = 0;
var life = null;
var star = null;
var bulletPower = 1;
var superPower = 3;

//bullets object
var playerBullets = null;
var enemyBullets = null;
var bossBullets = null;

//bullets damage

//sound initializers
var soundLevelUp;
var shotTaken;

// current mobs and mob stats
var player = null;
var bugs = new Array();
var enemy = null;
var boss = null;
var bugLife = 0.7;
var totalCurrentBugs = 0;
var bulletBoss = 1;
var bulletEnemie = 1;

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });

    this.controls;
    this.track;
    this.text;
  }

  create() {
    //Start Sound
    this.sound.play("gameSound", {
      loop: true,
      volume: 0.6,
    });

    // Set world bounds ( limites )
    this.physics.world.setBounds(-500, -600, width * 4, height * 4);

    // Add 2 groups for Bullet objects
    playerBullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    enemyBullets = this.physics.add.group({
      classType: Bulletenemy,
      runChildUpdate: true,
    });

    bossBullets = this.physics.add.group({
      classType: BulletBoss,
      runChildUpdate: true,
    });

    score = 0;

    this.input.keyboard.on(
      "keydown-R",
      function () {
        if (superPower > 0) {
          this.destroyAllBugs();
        }
      },
      this
    );

    spriteBounds = Phaser.Geom.Rectangle.Inflate(
      Phaser.Geom.Rectangle.Clone(this.physics.world.bounds),
      -100,
      -100
    );

    // Add background player, enemy, reticle, healthpoint sprites
    var background = this.add.image(width, height, "background");

    soundLevelUp = this.sound.add("levelUp");
    var shot = this.sound.add("shot");
    shotTaken = this.sound.add("shotTaken");

    player = this.physics.add.image(400, -400, "ship");
    reticle = this.physics.add.image(400, -400, "target");
    boss = this;
    enemy = this;

    // Set image/sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(width * 8, height * 8);

    //generate Random Power
    this.time.addEvent({
      delay: this.randomIntFromInterval(30000, 90000),
      callback: this.createstars,
      callbackScope: this,
      loop: true,
    });

    //generate Random life event
    this.time.addEvent({
      delay: this.randomIntFromInterval(40000, 150000),
      callback: this.createLife,
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
      .setDisplaySize(40, 40)
      .setCollideWorldBounds(false);

    //initializer vida do player
    player.health = 15;

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

          this.physics.add.collider(boss, bullethit, this.enemyHitCallback);

          this.physics.add.overlap(bugs, bullethit, this.killbugs);
        }
      },
      this
    );

    // Pointer lock will only work after mousedown
    this.game.input.mouse.requestPointerLock();

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

    //Score
    scoreText = this.add
      .bitmapText(-220, -200, "arcade", "Score: 0")
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);

    //Bullet Power
    bulletPowerText = this.add
      .bitmapText(-220, -140, "arcade", "Bullet Power: 1")
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);

    //Super Power Text
    superPowerText = this.add
      .bitmapText(-220, -90, "arcade", "Super Powers Remaining: 0")
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);

    //vida do player
    playerhealth = this.add
      .bitmapText(-220, -270, "arcade", "Life: 10")
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);

    this.input.keyboard.on(
      "keydown-P",
      function (event) {
        console.log("pause");
        this.scene.pause();
        this.scene.launch("pause");
      },
      this
    );
    console.log(this.game);

    this.events.on(
      "pause",
      function () {
        console.log("Scene paused");
        this.input.mouse.releasePointerLock();
      },
      this
    );

    this.events.on(
      "resume",
      function () {
        console.log("Scene resumed");
        this.game.input.mouse.requestPointerLock();
      },
      this
    );
  }

  update(time, delta) {
    if (moveKeys["left"].isDown) player.x -= 10;
    if (moveKeys["right"].isDown) player.x += 10;

    if (moveKeys["up"].isDown) player.y -= 10;
    if (moveKeys["down"].isDown) player.y += 10;

    console.log(totalCurrentBugs + " total Bugs");
    console.log(currentEnemies + " Inimigos Atuais");
    //create new Wave
    if (currentEnemies === 0) {
      currentWave++;
      this.createWave();
    }

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

    // Rotates enemy to face towards player
    if (boss != null)
      boss.rotation = Phaser.Math.Angle.Between(
        boss.x,
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
    //this.constrainReticle(reticle);

    // Make enemy fire
    this.enemyFire(enemy, player, time, this, "miniBoss");
    this.enemyFire(boss, player, time, this, "boss");

    if (player.health <= 0) {
      this.scene.start("Highscore", score);
      this.sound.stopAll();
    }

    this.controls.update(delta);
  }

  //----------------------------------------------------------------------------------------------
  //------------------------------ Create Objects  -----------------------------------------------
  //----------------------------------------------------------------------------------------------
  createbugs() {
    bugLife = bugLife * 1.2;
    let bugsToCreate = currentWave * 4 + score * 0.05;

    for (var i = 0; i < bugsToCreate; i++) {
      const pos = Phaser.Geom.Rectangle.Random(spriteBounds);
      currentEnemies++;
      totalCurrentBugs++;
      bugs[i] = this.physics.add.image(pos.x, pos.y, "bug").setScale(0.2);
      bugs[i].name = "bug" + i;

      bugs[i].setVelocity(
        Phaser.Math.Between(100, 300) + score,
        Phaser.Math.Between(100, 300) + score
      );

      //add colisions
      bugs[i].setBounce(1).setCollideWorldBounds(true);

      //bug a cada wave fica com mais vida + 0.2 do que o turno passado
      bugs[i].health = bugLife;

      if (Math.random() > 0.5) {
        bugs[i].body.velocity.x *= -1;
      } else {
        bugs[i].body.velocity.y *= -1;
      }

      this.physics.add.collider(player, bugs[i], this.playerHitCallback);
      this.physics.add.collider(bugs[i], bullethit, this.killbugs);
    }
  }

  createenemy() {
    const pos = Phaser.Geom.Rectangle.Random(spriteBounds);
    bulletEnemie = bulletEnemie + 0.2;

    currentEnemies++;

    enemy = this.physics.add.image(pos.x, pos.y, "enemy");
    enemy
      .setOrigin(0.5, 0.5)
      .setDisplaySize(132 + score, 120 + score)
      .setCollideWorldBounds(true);

    enemy.health = 3 + score / 4;
    enemy.lastFired = 0;
  }

  createBoss() {
    //random positiom
    const pos = Phaser.Geom.Rectangle.Random(spriteBounds);
    bulletBoss = bulletBoss * 1.7;
    currentEnemies++;

    boss = this.physics.add.image(pos.x, pos.y, "boss");
    boss
      .setOrigin(0.5, 0.5)
      .setDisplaySize(600 + score, 600 + score)
      .setCollideWorldBounds(true);

    boss.health = 17 + score / 4;
    boss.lastFired = 0;
  }

  createstars() {
    const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

    star = this.physics.add.image(pos.x, pos.y, "star1");
    star.setOrigin(0.5, 0.5).setDisplaySize(50, 50).setCollideWorldBounds(true);

    this.physics.add.overlap(player, star, this.buffPower);
  }

  createLife() {
    //random position
    const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

    life = this.physics.add.image(pos.x, pos.y, "heart");
    life.setOrigin(0.5, 0.5).setDisplaySize(50, 50).setCollideWorldBounds(true);

    this.physics.add.overlap(player, life, this.buffLife);
  }

  //generates a New Wave
  createWave() {
    var WaveText = this.add
      .bitmapText(width / 1.5, 1, "arcade", "Starting Wave " + currentWave, 70)
      .setTint(0xff0000)
      .setScrollFactor(0, 0)
      .setOrigin(0.6, 0.2);

    if (currentWave % 10 === 0) {
      superPower++;
      WaveText.setText("MEGA ROUND ! - " + currentWave);
      this.createenemy();
      this.createBoss();
      this.createbugs();
    } else if (currentWave % 5 === 0) {
      superPower++;
      WaveText.setText("BOSS ROUND! FIGHT!! - " + currentWave);
      this.createBoss();
      this.createenemy();
    } else {
      WaveText.setText("Starting Wave - " + currentWave);
      this.createbugs();
      this.createenemy();
    }

    superPowerText.setText("Super Powers Remaining: " + superPower);

    setTimeout(() => {
      WaveText.setVisible(false);
    }, 6000);
  }

  //---------------------------------------------------------------------------------------------
  //-------------------------Bullet Actions and Buffs--------------------------------------------
  //---------------------------------------------------------------------------------------------

  enemyHitCallback(enemyHit, bulletHit) {
    // Reduce health of enemy
    if (bulletHit.active === true && enemyHit.active === true) {
      enemyHit.health = enemyHit.health - bulletPower;

      // Kill enemy if health <= 0
      if (enemyHit.health <= 0) {
        score = score + 3;
        scoreText.setText("Score: " + score);
        currentEnemies--;
        enemyHit.destroy();
      }

      if (bulletHit.texture.key === "bug") {
        totalCurrentBugs--;
      }
      // Destroy bullet
      bulletHit.destroy();
    }
  }

  killbugs(bug, bulletHit) {
    // Reduce health of enemy
    bug.health = bug.health - bulletPower;

    if (bug.health <= 0) {
      score++;
      scoreText.setText("Score: " + score);
      currentEnemies--;
      totalCurrentBugs--;
      bug.destroy();
    }

    // Destroy bullet
    bulletHit.destroy();
  }

  buffPower(player, star) {
    bulletPower++;
    soundLevelUp.play({ volume: 1.5 });
    bulletPowerText.setText("Bullet Power: " + bulletPower);
    star.destroy();
  }

  buffLife(player, life) {
    player.health = player.health + 2;
    playerhealth.setText("Life: " + player.health.toFixed(0));
    soundLevelUp.play({ volume: 1.5 });
    life.destroy();
  }

  //power que destroi todos os bugs
  destroyAllBugs() {
    bugs.forEach((element) => {
      element.destroy();
    });
    currentEnemies = currentEnemies - totalCurrentBugs;
    totalCurrentBugs = 0;
    var power = this.sound.add("powerSound");
    power.play();
    superPower--;
    superPowerText.setText("Super Powers Remaining: " + superPower);
  }

  playerHitCallback(playerHit, bulletHit) {
    shotTaken.play();

    if (bulletHit.active === true && playerHit.active === true) {
      // Reduce health of player
      //caso aconteça colisão entre bug e nave decrementar do numero total de inimigos

      if (bulletHit.texture.key === "bug") {
        console.log("Colidi com um bug");
        currentEnemies--;
        totalCurrentBugs--;
        playerHit.health = playerHit.health - 1;
      }
      if (bulletHit.texture.key === "boss") {
        playerHit.health = playerHit.health - bulletBoss;
      } else {
        playerHit.health = playerHit.health - bulletEnemie;
      }

      playerhealth.setText("Life: " + player.health.toFixed(0));
      // Destroy bullet
      bulletHit.body.gameObject.setTint(0xff0000);
      bulletHit.destroy();
    }
  }

  enemyFire(enemy, player, time, gameObject, type) {
    if (enemy.active === false) {
      return;
    }

    if (time - enemy.lastFired > 1000) {
      enemy.lastFired = time;
      var bullet;
      if (type === "boss") {
        // Get bullet from bullets group
        bullet = bossBullets.get().setActive(true).setVisible(true);
      } else {
        bullet = enemyBullets.get().setActive(true).setVisible(true);
      }

      if (bullet) {
        bullet.fire(enemy, player);
        // Add collider between bullet and player
        gameObject.physics.add.collider(player, bullet, this.playerHitCallback);
      }
    }
  }

  //-------------------------------------------------------------------------------------
  //-------------------------Constraint Physics -----------------------------------------
  //-------------------------------------------------------------------------------------

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

  //get random value timer
  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

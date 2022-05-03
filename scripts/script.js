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

var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
            this.speed = 2;
            this.born = 0;
            this.direction = 0;
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.setSize(15, 15, true);
        },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

var Bulletenemy = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bulletenemy');
            this.speed = 1;
            this.born = 0;
            this.direction = 0;
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.setSize(12, 12, true);
        },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Preloader ()
        {
            Phaser.Scene.call(this, { key: 'preloader' });
        },

    preload: function ()
    {
        // Load in images and sprites
        this.load.image('ship', 'assets/img/ship2.png');
        this.load.image('enemy', 'assets/img/enemyship.png');
        this.load.image('star1', 'assets/img/star.png');
        this.load.image('bug', 'assets/img/bug.png');
        this.load.image('base', 'assets/img/Mothership.png');
        this.load.image('bullet', 'assets/img/lase1.png');
        this.load.image('playbutton', 'assets/img/play.png');
        this.load.image('bulletenemy', 'assets/img/lase3.png');
        this.load.image('target', 'assets/img/crossair.png');
        this.load.image('backgroundpedras', 'assets/img/pedras.png');
        this.load.image('background', 'assets/img/sky.jpg');


        this.load.bitmapFont('arcade', 'assets/input/arcade.png', 'assets/input/arcade.xml');

        this.load.audio('shot', 'assets/audio/shot.mp3');
    },

    create: function ()
    {
        this.scene.start('mainmenu');
    }

});



var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MainMenu ()
        {
            Phaser.Scene.call(this, { key: 'mainmenu' });
            window.MENU = this;
        },

    create: function ()
    {

        var title = this.add.bitmapText(20, 200, 'arcade', 'Welcome to Space Defense').setTint(0xff00ff);

        this.tweens.add({
            targets: title,
            y: 220 ,
            duration: 5000,
            yoyo: true,
            repeat: -1
        });


        var bg = this.add.image(400, 400, 'playbutton');
        bg.setOrigin(0.5, 0.5).setDisplaySize(200, 200);

        bg.setInteractive();

        bg.once('pointerup', function () {

            this.scene.start('game');

        }, this);
    }

});

var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Game ()
    {
        Phaser.Scene.call(this, { key: 'game' });
        window.GAME = this;

        this.controls;
        this.track;
        this.text;
    },

    create: function ()
    {

        // Set world bounds
        this.physics.world.setBounds(-400, -400, 2500, 1900);
        //this.physics.world.setBounds(0, 0, 1600, 1200);

        // Add 2 groups for Bullet objects
        playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        enemyBullets = this.physics.add.group({ classType: Bulletenemy, runChildUpdate: true });

        score = 0;
        gold = 1000;

        spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -100, -100);

        // Add background player, enemy, reticle, healthpoint sprites
        var background2 = this.add.image(800, 600, 'background');
        var background = this.add.image(800, 600, 'backgroundpedras');

        var shot = this.sound.add('shot');

        player = this.physics.add.image(400, -400, 'ship');
        reticle = this.physics.add.image(400, -400, 'target');
        mothership = this.physics.add.image(800, 700, 'base');
        enemy = this;
        hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0, 0);
        hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0, 0);
        hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0, 0);
        hp4 = this.add.image(-200, -250, 'target').setScrollFactor(0, 0);
        hp5 = this.add.image(-150, -250, 'target').setScrollFactor(0, 0);

        // Set image/sprite properties
        background2.setOrigin(0.5, 0.5).setDisplaySize(3600, 3200);
        background.setOrigin(0.5, 0.5).setDisplaySize(2600, 2200);
        mothership.setOrigin(0.5, 0.5).setDisplaySize(600, 400).setCollideWorldBounds(true);
        wavestars = this.time.addEvent({ delay: 40000, callback: this.createstars, callbackScope: this, loop: true});
        waveenemy = this.time.addEvent({ delay: 30000 + score * 4, callback: this.createenemy, callbackScope: this, loop: true});
        wavebugs = this.time.addEvent({ delay: 20000 + score * 4, callback: this.createbugs, callbackScope: this, loop: true });
        player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);

        reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(false);
        hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        hp4.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        hp5.setOrigin(0.5, 0.5).setDisplaySize(50, 50);


        //pedras com yoyo
        this.tweens.add({
            targets: background,
            y: game.config.height /2 +200,
            duration: 5000,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: mothership,
            y: game.config.height /2 +200,
            duration: 5000,
            yoyo: true,
            repeat: -1
        });

        player.health = 10;
        mothership.health = 40;


        // Set camera properties
        this.cameras.main.zoom = 0.5;
        this.cameras.main.startFollow(player);

        // Creates object for input with WASD kets
        moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });


        // Fires bullet from player on left click of mouse
        this.input.on('pointerdown', function (pointer, time, lastFired) {
            if (player.active === false)
                return;
            shot.play();
            // Get bullet from bullets group
            bullethit = playerBullets.get().setActive(true).setVisible(true);

            if (bullethit)
            {
                bullethit.fire(player, reticle);
                this.physics.add.collider(enemy, bullethit, this.enemyHitCallback);

                this.physics.add.overlap(bugs, bullethit, this.killbugs);
            }
        }, this);

        // Pointer lock will only work after mousedown
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        this.input.keyboard.on('keydown_Q', function (event) {
            if (game.input.mouse.locked)
                game.input.mouse.releasePointerLock();
        }, 0, this);

        // Move reticle upon locked pointer move
        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked)
            {
                reticle.x += pointer.movementX;
                reticle.y += pointer.movementY;
            }
        }, this);


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
            maxSpeed: 1.0
        };

        controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.add.bitmapText(-300, -800, 'arcade', 'Who to play:\n\nDefende the base from the bugs\nQ-E to zoom in and out\nW-A-S-D to fly the ship \nMouse1 to shoot the enemies\nThe game ends when your ship or the base dies.').setTint(0x00ff00);
        scoreText = this.add.bitmapText(-220, -200, 'arcade', 'Score: 0').setTint(0xff0000).setScrollFactor(0, 0).setOrigin(0.6, 0.2);
        mothershiphealth = this.add.bitmapText(500, -270, 'arcade', 'Base health: 50').setTint(0xff0000).setScrollFactor(0, 0).setOrigin(0.6, 0.2);
        playerhealth =  this.add.bitmapText(-50, -270, 'arcade', '10').setTint(0xff0000).setScrollFactor(0, 0).setOrigin(0.6, 0.2);



    },

    createbugs: function() {
        for (var i =0; i < 5 + score/2 ; i++){
            const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

            bugs[i] = this.physics.add.image(pos.x, pos.y, 'bug').setScale(.2);
            bugs[i].name = 'bug' + i


            bugs[i].setVelocity(Phaser.Math.Between(100, 300) + score, Phaser.Math.Between(100, 300) + score);
            bugs[i].setBounce(1).setCollideWorldBounds(true);
            bugs[i].health = 1;

            if (Math.random() > 0.5)
            {
                bugs[i].body.velocity.x *= -1;
            }
            else
            {
                bugs[i].body.velocity.y *= -1;
            }

            this.physics.add.collider(player, bugs[i],  this.playerHitCallback);
            this.physics.add.overlap(mothership, bugs[i],  this.damageBase);
            this.physics.add.collider(bugs[i], bullethit, this.killbugs);

        }
    },
    createenemy: function () {
        const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

        enemy = this.physics.add.image(pos.x, pos.y, 'enemy');
        enemy.setOrigin(0.5, 0.5).setDisplaySize(132+score, 120+score).setCollideWorldBounds(true);

        enemy.health = 3 + score / 4;
        enemy.lastFired = 0;
    },

    createstars: function () {
        const pos = Phaser.Geom.Rectangle.Random(spriteBounds);

        star = this.physics.add.image(pos.x, pos.y, 'star1');
        star.setOrigin(0.5, 0.5).setDisplaySize(50, 50).setCollideWorldBounds(true);

        this.physics.add.overlap(player, star, this.buffs);

    },

    enemyHitCallback: function(enemyHit, bulletHit)
    {
        // Reduce health of enemy
        if (bulletHit.active === true && enemyHit.active === true)
        {
            enemyHit.health = enemyHit.health - 1;

            // Kill enemy if health <= 0
            if (enemyHit.health <= 0)
            {
                score = score + 3 ;
                scoreText.setText('Score: ' + score);
                enemyHit.destroy();
            }

            // Destroy bullet
            bulletHit.destroy();
        }
    },

    killbugs: function (bug, bulletHit)
    {
    // Reduce health of enemy

    bug.health = bug.health - 1;

    score++ ;
    scoreText.setText('Score: ' + score);
    bug.destroy();


    // Destroy bullet
    bulletHit.destroy();

    },

    buffs: function (player, star)
    {
        // Reduce health of enemy

        player.health = player.health + 3;
        mothership.health = mothership.health + 5;

        mothershiphealth.setText('Base health: ' + mothership.health);
        playerhealth.setText(player.health);
        star.destroy();

    },

    damageBase: function (playerHit, bulletHit)
    {
        // Reduce health of player
        if (bulletHit.active === true && playerHit.active === true)
        {
            playerHit.health = playerHit.health - 1;
            score--;
            scoreText.setText('Score: ' + score);
            mothershiphealth.setText('Base health: ' + mothership.health);

            bulletHit.destroy();
        }
    },

    playerHitCallback: function (playerHit, bulletHit)
    {
        // Reduce health of player
        if (bulletHit.active === true && playerHit.active === true)
        {
            playerHit.health = playerHit.health - 1;

            // Kill hp sprites and kill player if health <= 0
            if (playerHit.health == 8)
            {
                hp5.destroy();
            }
            else if (playerHit.health == 6)
            {
                hp4.destroy();
            }
            else if (playerHit.health == 4)
            {
                hp3.destroy();
            }
            else if (playerHit.health == 2)
            {
                hp2.destroy();
            }
            else if (playerHit.health == 0)
            {
                hp1.destroy();

            }

            playerhealth.setText(player.health);
            // Destroy bullet
            //bulletHit.setActive(false).setVisible(false);
            bulletHit.body.gameObject.setTint(0xff0000);
            //this.time.addEvent({ delay: 300, callback: bulletHit, callbackScope: destroy() });
            bulletHit.destroy();
        }
    },

    enemyFire: function(enemy, player, time, gameObject)
    {
        if (enemy.active === false)
        {
            return;
        }

        if ((time - enemy.lastFired) > 1000)
        {
            enemy.lastFired = time;

            // Get bullet from bullets group
            var bullet = enemyBullets.get().setActive(true).setVisible(true);

            if (bullet)
            {
                bullet.fire(enemy, player);
                // Add collider between bullet and player
                gameObject.physics.add.collider(player, bullet, this.playerHitCallback);
            }
        }
        },

        // Ensures sprite speed doesnt exceed maxVelocity while update is called
        constrainVelocity: function (sprite, maxVelocity)
        {
        if (!sprite || !sprite.body)
            return;

        var angle, currVelocitySqr, vx, vy;
        vx = sprite.body.velocity.x;
        vy = sprite.body.velocity.y;
        currVelocitySqr = vx * vx + vy * vy;

        if (currVelocitySqr > maxVelocity * maxVelocity)
        {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            sprite.body.velocity.x = vx;
            sprite.body.velocity.y = vy;
        }
    },

    // Ensures reticle does not move offscreen
    constrainReticle: function (reticle)
    {
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle

    // Ensures reticle cannot be moved offscreen (player follow)
    if (distX > 800)
        reticle.x = player.x+800;
    else if (distX < -800)
        reticle.x = player.x-800;

    if (distY > 600)
        reticle.y = player.y+600;
    else if (distY < -600)
        reticle.y = player.y-600;
    },

    update: function (time, delta)
    {

    if (moveKeys['left'].isDown)
        player.x-=10;
    if (moveKeys['right'].isDown)
        player.x+=10;

    if (moveKeys['up'].isDown)
        player.y-=10;
    if (moveKeys['down'].isDown)
        player.y+=10;

    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // Rotates enemy to face towards player
    if (enemy != null)
        enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);

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
        this.scene.start('Highscore');


    controls.update(delta);
    }
});

class InputPanel extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'InputPanel', active: false });

        this.chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];

        this.cursor = new Phaser.Math.Vector2();

        this.text;
        this.block;

        this.name = '';
        this.charLimit = 3;
    }

    create ()
    {
        let text = this.add.bitmapText(130, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-');

        text.setLetterSpacing(20);
        text.setInteractive();

        this.add.image(text.x + 430, text.y + 148, 'rub');
        this.add.image(text.x + 482, text.y + 148, 'end');

        this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0);

        this.text = text;

        this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
        this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
        this.input.keyboard.on('keyup_UP', this.moveUp, this);
        this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
        this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
        this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
        this.input.keyboard.on('keyup', this.anyKey, this);

        text.on('pointermove', this.moveBlock, this);
        text.on('pointerup', this.pressKey, this);

        this.tweens.add({
            targets: this.block,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 350
        });
    }

    moveBlock (pointer, x, y)
    {
        let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
        let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
        let char = this.chars[cy][cx];

        this.cursor.set(cx, cy);

        this.block.x = this.text.x - 10 + (cx * 52);
        this.block.y = this.text.y - 2 + (cy * 64);
    }

    moveLeft ()
    {
        if (this.cursor.x > 0)
        {
            this.cursor.x--;
            this.block.x -= 52;
        }
        else
        {
            this.cursor.x = 9;
            this.block.x += 52 * 9;
        }
    }

    moveRight ()
    {
        if (this.cursor.x < 9)
        {
            this.cursor.x++;
            this.block.x += 52;
        }
        else
        {
            this.cursor.x = 0;
            this.block.x -= 52 * 9;
        }
    }

    moveUp ()
    {
        if (this.cursor.y > 0)
        {
            this.cursor.y--;
            this.block.y -= 64;
        }
        else
        {
            this.cursor.y = 2;
            this.block.y += 64 * 2;
        }
    }

    moveDown ()
    {
        if (this.cursor.y < 2)
        {
            this.cursor.y++;
            this.block.y += 64;
        }
        else
        {
            this.cursor.y = 0;
            this.block.y -= 64 * 2;
        }
    }

    anyKey (event)
    {
        //  Only allow A-Z . and -

        let code = event.keyCode;

        if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD)
        {
            this.cursor.set(6, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS)
        {
            this.cursor.set(7, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE)
        {
            this.cursor.set(8, 2);
            this.pressKey();
        }
        else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z)
        {
            code -= 65;

            let y = Math.floor(code / 10);
            let x = code - (y * 10);

            this.cursor.set(x, y);
            this.pressKey();
        }
    }

    pressKey ()
    {
        let x = this.cursor.x;
        let y = this.cursor.y;
        let nameLength = this.name.length;

        this.block.x = this.text.x - 10 + (x * 52);
        this.block.y = this.text.y - 2 + (y * 64);

        if (x === 9 && y === 2 && nameLength > 0)
        {
            //  Submit
            this.events.emit('submitName', this.name);
        }
        else if (x === 8 && y === 2 && nameLength > 0)
        {
            //  Rub
            this.name = this.name.substr(0, nameLength - 1);

            this.events.emit('updateName', this.name);
        }
        else if (this.name.length < this.charLimit)
        {
            //  Add
            this.name = this.name.concat(this.chars[y][x]);

            this.events.emit('updateName', this.name);
        }
    }
}

class Starfield extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Starfield', active: true });

        this.stars;

        this.distance = 300;
        this.speed = 250;

        this.max = 500;
        this.xx = [];
        this.yy = [];
        this.zz = [];
    }

    preload ()
    {
        this.load.image('star', 'assets/input/star4.png');
    }

    create ()
    {
        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;

        this.stars = this.add.blitter(0, 0, 'star');

        for (let i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * 800) - 400;
            this.yy[i] = Math.floor(Math.random() * 600) - 300;
            this.zz[i] = Math.floor(Math.random() * 1700) - 100;

            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = 400 + this.xx[i] * perspective;
            let y = 300 + this.yy[i] * perspective;

            this.stars.create(x, y);
        }
    }

    update (time, delta)
    {
        for (let i = 0; i < this.max; i++)
        {
            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = 400 + this.xx[i] * perspective;
            let y = 300 + this.yy[i] * perspective;

            this.zz[i] += this.speed * (delta / 1000);

            if (this.zz[i] > 300)
            {
                this.zz[i] -= 600;
            }

            let bob = this.stars.children.list[i];

            bob.x = x;
            bob.y = y;
        }
    }

}

class Highscore extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Highscore'});

        this.playerText;
    }

    preload ()
    {
        this.load.image('block', 'assets/input/block.png');
        this.load.image('rub', 'assets/input/rub.png');
        this.load.image('end', 'assets/input/end.png');

        //this.load.bitmapFont('arcade', 'assets/input/arcade.png', 'assets/input/arcade.xml');
    }

    create ()
    {
        this.add.bitmapText(100, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);
        this.add.bitmapText(100, 310, 'arcade', '1ST   ' + score).setTint(0xff0000);

        this.playerText = this.add.bitmapText(580, 310, 'arcade', '').setTint(0xff0000);

        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;

        this.scene.launch('InputPanel');

        let panel = this.scene.get('InputPanel');

        //  Listen to events from the Input Panel scene
        panel.events.on('updateName', this.updateName, this);
        panel.events.on('submitName', this.submitName, this);

    }

    submitName ()
    {
        this.scene.stop('InputPanel');

        this.add.bitmapText(100, 160, 'arcade', 'Leader board:').setTint(0xff00ff);

        this.add.bitmapText(100, 360, 'arcade', '2ND   20       ANT').setTint(0xff8200);
        this.add.bitmapText(100, 410, 'arcade', '3RD   15       .-.').setTint(0xffff00);
        this.add.bitmapText(100, 460, 'arcade', '4TH   12       BOB').setTint(0x00ff00);
        this.add.bitmapText(100, 510, 'arcade', '5TH   8        ZIK').setTint(0x00bfff);

        this.input.once('pointerup', function (event) {

            this.scene.start('mainmenu');

        }, this);
    }

    updateName (name)
    {
        this.playerText.setText(name);
    }

}



var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [ Preloader, MainMenu, Game, Starfield, Highscore, InputPanel ]
};

var game = new Phaser.Game(config);

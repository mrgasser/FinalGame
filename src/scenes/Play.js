class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    create() {

        this.gameFloor = this.add.rectangle(0, game.config.height - 10, game.config.width, 50, 0xf0df0f).setOrigin(0);
        this.physics.world.enable(this.gameFloor);
        this.gameFloor.body.setImmovable();

        // Make the background
        this.playBackground = this.add.image(0, 0, 'pentLayer1').setOrigin(0,0);
        this.playBackground.setDisplaySize(game.config.width, game.config.height);

        this.playBackground2 = this.add.image(0, 0, 'pentLayer2').setOrigin(0,0);
        this.playBackground2.setDisplaySize(game.config.width, game.config.height);

        // Text for scene
        this.scoreText = this.add.text(44, 55, "Score:").setOrigin(0,0);
        this.scoreText.setScrollFactor(0);
        this.scoreTextValue = this.add.text(110, 55, "0").setOrigin(0,0);
        this.scoreTextValue.setScrollFactor(0);

        this.healthText = this.add.text(44, 35, "Health:").setOrigin(0, 0);
        this.healthText.setScrollFactor(0);

        // this.facing = this.add.text(0, 15, '', { font: '16px Courier', fill: '#00ff00' });
        // this.facingPlayer = this.add.text(0, 30, '', { font: '16px Courier', fill: '#00ff00' });
        // this.playerState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        // this.enemyState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        // this.punched = this.add.text(game.config.width/2, game.config.height/2, 'Arrow keys to move \n Space to punch \n Hold Space for powerful punch', { font: '16px Courier', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        
        // Return to menu configuration
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.add.text(game.config.width/2, 20, "Press R to return to Menu").setOrigin(0.5);


        // this.anims.create({
        //     key: "playerDied",
        //     frames: this.anims.generateFrameNumbers()
        // })

        // Initialize all the different groups
        this.hitboxes = this.physics.add.group();
        this.physics.world.enable(this.hitboxes);

        this.knockHitboxes = this.physics.add.group();
        this.physics.world.enable(this.knockHitboxes);

        this.enemyHitboxes = this.physics.add.group();
        this.physics.world.enable(this.enemyHitboxes);

        this.enemyGroup = this.add.group();
        this.physics.world.enable(this.enemyHitboxes);

        // Initialize the prefabs in the scene
        this.player = new Player(this, game.config.width/3, game.config.height - 100, 120, 35, 'main_player');
// <<<<<<< songs-and-tutorial-prompts
//         //this.enemy = new Enemy(this,game.config.width - game.config.width/3, game.config.height/2, 'the_receptionist');
//         //this.enemy2 = new Enemy(this,game.config.width - game.config.width/3, game.config.height/2, 'the_receptionist');
        
// =======
//         this.enemy = new Enemy(this,game.config.width - game.config.width/3, game.config.height - 100, 'the_receptionist');
//         this.enemy2 = new Enemy(this,game.config.width - game.config.width/3, game.config.height - 100, 'the_receptionist');
//         this.enemyGroup.add(this.enemy);
//         this.enemyGroup.add(this.enemy2);
    
//         // game over bools
// >>>>>>> main
        this.gameOver = false;
        this.end = true;
        
        // Physics Collisions
        this.physics.add.collider(this.enemyGroup, this.gameFloor);
        this.physics.add.collider(this.player, this.gameFloor);

        // Scene Camera Test
        this.input.keyboard.on('keydown-O', this.moveCam.bind(this));

        // CAMERA STUFF
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBounds(0, 0, game.config.width, game.config.height, true);
        this.cameras.main.setZoom(1.1, 1.1);
        this.cameras.main.startFollow(this.player, false, 0.01, 0.01);

        this.enemyObjects = this.add.group();
        this.enemyObjects.createMultiple({
            classType: Enemy,
            key: 'the_receptionist',
            //runChildUpdate: true,
            repeat: -1,
            maxSize: 3,
            setXY: {
                x:100,
                y:100,
                stepX:0,
                stepY:0
            },
        })
        this.playTheme = this.sound.add("playBeat");
        var musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            //detune: 2,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.playTheme.play(musicConfig);

        // this.enemyAmount = 3;
        // this.enemyGroupTest = this.add.group(this.enemy, {
        //     classType: Enemy,
        //     //repeat: this.enemyAmount - 1,
        //     setXY: { x: 25, y: 60},
        //     runChildUpdate: true,
        //     active: true,
        //     maxSize: 2
        // });

        // this.wave = 1;

    }

    moveCam(){
        this.cameras.main.pan(game.config.width/2, -game.config.height * 2, 10000);
        this.cameras.main.on('pancomplete', () => {console.log("finished pan");});
    }

    update() {

        //Debug stuff
        {
            // this.playerState.x = this.player.body.x;
            // this.playerState.y = this.player.body.y - 20;
            // this.enemyState.x = this.enemy.body.x;
            // this.enemyState.y = this.enemy.body.y - 20;

            // this.facing.setText('Enemy: ' + this.enemy.body.facing);
            // this.facingPlayer.setText('Player: ' + this.player.body.facing);
            // this.playerState.setText(this.player.currState());
            //this.enemyState.setText(this.enemy.currState());
        }

        //this.player.update(this);
        //this.enemy.update(this, this.player);
        //this.enemy2.update(this, this.player);

        if (this.end) {
            this.player.update(this);
        }
        //this.enemy.update(this, this.player);
        //this.enemy2.update(this, this.player);

        if (this.end && this.player.healthBar.health == 0) {
            this.gameOverFucn();
        }

        // go to menu scene
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select_2');
            this.scene.start('menuScene');
        }

        // update score
        this.scoreTextValue.text = score;
    }

    gameOverFucn() {
        this.playTheme.stop();
        this.sound.play('sfx_gameOver');
        this.gameOver = true;
        this.end = false;
        this.add.text(game.config.width/2, game.config.height/2 - 40, "GAME OVER").setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - 20, "Final Score: " + score).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "Press R to return to Menu").setOrigin(0.5);
        // add animation
        this.player.destroy();
        // game.scene.pause('playScene');
    }
}
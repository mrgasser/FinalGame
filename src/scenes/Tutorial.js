class Tutorial extends Phaser.Scene{
    constructor() {
        super("tutorialScene");
    }

    create() {

        // Make the floor
        this.gameFloor = this.add.rectangle(0, game.config.height - 10, game.config.width, 50, 0xf0df0f).setOrigin(0);
        this.physics.world.enable(this.gameFloor);
        this.gameFloor.body.setImmovable();

        //Make the background
        this.lobbyBackground = this.add.image(0, 0, 'lobby').setOrigin(0,0);
        this.lobbyBackground.setDisplaySize(game.config.width, game.config.height);

        // Text for scene
        //this.cursors = this.input.keyboard.createCursorKeys();
        this.add.text(1, 0, "Tutorial Scene");
        //this.facing = this.add.text(0, 15, '', { font: '16px Courier', fill: '#00ff00' });
        //this.facingPlayer = this.add.text(0, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.playerState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        this.enemyState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        //this.punched = this.add.text(game.config.width/2, game.config.height/2, 'Arrow keys to move \n Space to punch \n Hold Space for powerful punch', { font: '16px Courier', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        
        // Make UI Stuff
        this.upArrow = this.add.image(game.config.width/2 - 10, game.config.height/2 + 95, 'upArrow').setOrigin(0.5,0.5);
        this.upArrow.setAlpha(0);

        this.arrowFlash = this.plugins.get('rexflashplugin').add(this.upArrow, {
            duration: 500,
            repeat: -1
        });

        // Return to menu configuration
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        //this.add.text(game.config.width/2, 20, "Press R to return to Menu").setOrigin(0.5);

        // Make Animations
        this.anims.create({
            key: 'recepIdle',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 0, end: 7}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'recepStun',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 8, end: 11}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'recepKnocked',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 12, end: 13}),
            frameRate: 2,
            //repeat: -1
        });

        this.anims.create({
            key: 'recepLaydown',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 18, end:18}),
            //frameRate: 10,
            //repeat: -1
        });

        this.anims.create({
            key: 'recepWalk',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 26, end: 29}),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'recepPunch',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 19, end: 25}),
            frameRate: 30,
            //repeat: -1
        });

        // Initialize all the different groups
        this.hitboxes = this.physics.add.group();
        this.physics.world.enable(this.hitboxes);

        this.knockHitboxes = this.physics.add.group();
        this.physics.world.enable(this.knockHitboxes);

        this.enemyHitboxes = this.physics.add.group();
        this.physics.world.enable(this.enemyHitboxes);

        this.enemyGroup = this.add.group();
        this.physics.world.enable(this.enemyGroup);

        //initialize tutorial enemy
        this.enemy = new Enemy(this,game.config.width - game.config.width/3, game.config.height - 100, 'the_receptionist');        
        this.enemyGroup.add(this.enemy);
        
        this.enemy.on('destroy', () => {
            //console.log("im dead");
            this.upArrow.setAlpha(1);
            this.physics.add.existing(this.upArrow);
            this.arrowFlash.flash();
        });

        // Initialize the prefabs in the scene
        this.player = new Player(this, game.config.width/3, game.config.height - 100, 'main_player');

        // Physics Collisions
        this.physics.add.collider(this.enemyGroup, this.gameFloor);
        this.physics.add.collider(this.player, this.gameFloor);

        // Scene Camera Test
        this.input.keyboard.on('keydown-O', this.moveCam.bind(this));

        // Play dat tutorial beat
        this.tutorialTheme = this.sound.add("tutorialBeat");
        var musicConfig = {
            mute: false,
            //volume: 0.5,
            rate: 1,
            //detune: 2,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.tutorialTheme.play(musicConfig);

        // CAMERA STUFF
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        this.cameras.main.setZoom(1.1, 1.1);
        this.cameras.main.startFollow(this.player, false, 0.01, 0.01);
    }

    moveCam(){
        this.cameras.main.pan(game.config.width/2, -game.config.height * 1.5, 5000, "Sine.easeIn");
        this.cameras.main.on("camerapancomplete", () => {
            console.log("DONE");
        })
    }

    update() {

        //Debug stuff
        {
            // this.playerState.x = this.player.body.x;
            // this.playerState.y = this.player.body.y - 20;
            // this.enemyState.x = this.enemy.body.x;
            // this.enemyState.y = this.enemy.body.y - 20;

            //this.facing.setText('Enemy: ' + this.enemy.body.facing);
            //this.facingPlayer.setText('Player: ' + this.player.body.facing);
            //this.playerState.setText(this.player.currState());
            this.enemyState.setText(this.enemy.currState());
        }


        this.player.update(this);

        if(this.enemy){
            this.enemy.update(this, this.player);
        }
        
        // go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select_2');
            this.tutorialTheme.stop();
            this.scene.start('menuScene');
        }

    }
}
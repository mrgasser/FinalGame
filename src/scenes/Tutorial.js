class Tutorial extends Phaser.Scene{
    constructor() {
        super("tutorialScene");
    }

    create() {

        // Make the floor
        this.gameFloor = this.add.rectangle(0, game.config.height - 10, game.config.width, 50, 0xf0df0f).setOrigin(0);
        this.physics.world.enable(this.gameFloor);
        this.gameFloor.body.setImmovable();

        // Define the key
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);

        // Make the background
        this.lobbyBackground = this.add.image(0, 0, 'lobby').setOrigin(0,0);
        this.lobbyBackground.setDisplaySize(game.config.width, game.config.height);

        // Make the prompts
        this.walkPrompt = this.add.image(game.config.width/4, game.config.height/4, 'walkPrompt').setOrigin(0,0);
        this.punchPrompt = this.add.image(game.config.width * (2/4), game.config.height/4, 'punchPrompt').setOrigin(0,0);
        this.superPrompt = this.add.image(game.config.width * (3/4), game.config.height/4, 'superPrompt').setOrigin(0,0);

        // Text for scene
        //this.cursors = this.input.keyboard.createCursorKeys();
        //this.add.text(1, 0, "Tutorial Scene");
        //this.facing = this.add.text(0, 15, '', { font: '16px Courier', fill: '#00ff00' });
        //this.facingPlayer = this.add.text(0, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.playerState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        this.enemyState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        //this.punched = this.add.text(game.config.width/2, game.config.height/2, 'Arrow keys to move \n Space to punch \n Hold Space for powerful punch', { font: '16px Courier', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        
        // Make UI Stuff
        this.upArrow = this.add.image(game.config.width/2 - 10, game.config.height/2 + 95, 'upArrow').setOrigin(0.5,0.5);
        this.upArrow.setAlpha(0);

        // Make checkmarks

        this.arrowFlash = this.plugins.get('rexflashplugin').add(this.upArrow, {
            duration: 500,
            repeat: -1
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
            this.upArrow.setAlpha(1);
            this.physics.add.existing(this.upArrow);
            this.arrowFlash.flash();
        });

        // Initialize the prefabs in the scene
        this.player = new Player(this, game.config.width/3, game.config.height - 100,
        120, 35, 'main_player');

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

        // Change scene 
        this.physics.add.overlap(this.upArrow, this.player, () => {

            if(Phaser.Input.Keyboard.JustDown(keyUP)){
                console.log("going up");
                this.moveCam();
            }

        });

        // CAMERA STUFF
        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBounds(0, 0, game.config.width, game.config.height, true);
        this.cameras.main.setZoom(1.1, 1.1);
        this.cameras.main.startFollow(this.player, false, 0.01, 0.01);

        // MAKE THE CHECKMARKS
        
        

        // EVENT FOR CHECKMARKS
        this.input.keyboard.once('keydown-LEFT', () => {
            this.check1 = this.add.image(this.walkPrompt.x + 30, this.walkPrompt.y + 80, 'checkmark').setOrigin(0,0);
        });
        this.input.keyboard.once('keydown-RIGHT', () => {
            this.check1 = this.add.image(this.walkPrompt.x + 30, this.walkPrompt.y + 80, 'checkmark').setOrigin(0,0);
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.check2 = this.add.image(this.punchPrompt.x + 30, this.punchPrompt.y + 80, 'checkmark').setOrigin(0,0);
        });
        this.player.once('powerPunch', () => {
            this.check3 = this.add.image(this.superPrompt.x + 30, this.superPrompt.y + 80, 'checkmark').setOrigin(0,0);
        });
    }

    moveCam(){
        this.player.destroy();
        this.cameras.main.stopFollow();
        this.cameras.main.removeBounds();

        this.cameras.main.pan(this.cameras.main.centerX, game.config.height * -1.5, 5000, "Linear");
        this.cameras.main.on("camerapancomplete", () => {
            console.log("DONE");
            this.tutorialTheme.stop();
            this.scene.start('playScene');
        });
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
            //this.enemyState.setText(this.enemy.currState());
        }

        if(this.player.body){
            this.player.update(this);
        }

        if(this.enemy){
            this.enemy.update(this.player);
        }
        
        // go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select_2');
            this.tutorialTheme.stop();
            this.scene.start('playScene');
        }
    }
}
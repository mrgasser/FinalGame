class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('the_receptionist', "./assets/Enemies/receptionist.png", {
            frameWidth: 64,
            frameHeight: 55,
            startFrame: 0,
            endFrame: 18,
            repeat: -1
        });

        this.load.spritesheet('main_player', "./assets/Main_Character/mainPlayer.png", {
            frameWidth: 46,
            frameHeight: 46,
            startFrame: 0,
            endFrame: 15,
            repeat: -1
        });

        this.load.spritesheet('enemy1','./assets/enemySprite.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 18,
            repeat: -1
        });
        this.load.spritesheet('main_player_test','./assets/FinalCharacter.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 19,
            repeat: -1
        });

    }

    create() {

        this.gameFloor = this.add.rectangle(0, game.config.height - 10, game.config.width, 50, 0xf0df0f).setOrigin(0);
        this.physics.world.enable(this.gameFloor);
        this.gameFloor.body.setImmovable();
        //this.gameFloor.body.setFrictionX(100);

        // Text for scene
        //this.cursors = this.input.keyboard.createCursorKeys();
        this.add.text(1, 0, "Play Scene");
        this.facing = this.add.text(0, 15, '', { font: '16px Courier', fill: '#00ff00' });
        this.facingPlayer = this.add.text(0, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.playerState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        this.enemyState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        this.punched = this.add.text(game.config.width/2, game.config.height/2, 'Arrow keys to move, Space to punch', { font: '16px Courier', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        
        // Return to menu configuration
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.add.text(game.config.width/2, 20, "Press R to return to Menu").setOrigin(0.5);

        // Make Animations
        this.anims.create({
            key: 'recepIdle',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 0, end: 7}),
            frameRate: 10,
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
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 18}),
            //frameRate: 10,
            //repeat: -1
        });

        // this.anims.create({
        //     key: 'recepWalk',
        //     frames: this.anims.generateFrameNumbers('the_receptionist', {start: 14, end: 17}),
        //     frameRate: 8,
        //     repeat: -1
        // });
        // this.anims.create({
        //     key: 'recepPunch',
        //     frames: this.anims.generateFrameNumbers('the_receptionist', {start: 6, end: 13}),
        //     frameRate: 25,
        //     repeat: -1
        // });

        this.hitboxes = this.physics.add.group();
        this.physics.world.enable(this.hitboxes);

        this.enemy = new Enemy(this,game.config.width - game.config.width/3, game.config.height/2, 'the_receptionist');
        this.player = new Player(this, game.config.width/3, game.config.height - 100, 'main_player');
        

        // Physics Collisions
        this.physics.add.collider(this.enemy, this.gameFloor);
        this.physics.add.collider(this.player, this.gameFloor);
    }



    update() {

        //Debug stuff
        {
            this.playerState.x = this.player.body.x;
            this.playerState.y = this.player.body.y - 20;
            this.enemyState.x = this.enemy.body.x;
            this.enemyState.y = this.enemy.body.y - 20;

            this.facing.setText('Enemy: ' + this.enemy.body.facing);
            this.facingPlayer.setText('Player: ' + this.player.body.facing);
            this.playerState.setText(this.player.currState());
            this.enemyState.setText(this.enemy.currState());
        }

        // make circle follow player
        //this.farRange.x = this.player.x + 150;
        //this.farRange.y = this.player.y;


        this.player.update(this);
        this.enemy.update(this, this.player);

        // go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select_2');
            this.scene.start('menuScene');
        }

    }
}
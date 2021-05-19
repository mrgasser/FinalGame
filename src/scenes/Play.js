class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('main_player', "./assets/Main_Character/mainPlayer.png", {
            frameWidth: 50,
            frameHeight: 50,
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
            key: 'enemyIdle',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyWalk',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 14, end: 17}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyPunch',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 6, end: 13}),
            frameRate: 25,
            repeat: -1
        });

        this.hitboxes = this.physics.add.group();
        this.physics.world.enable(this.hitboxes);

        this.player = new Player(this, game.config.width/3, game.config.height, 'main_player');
        this.enemy = new Enemy(this,game.config.width - game.config.width/3, game.config.height/2, 'enemy1');
    }



    update() {

        //Debug stuff
        {
            this.playerState.x = this.player.x - (this.player.width/2);
            this.playerState.y = this.player.y - (this.player.height *2);
            this.enemyState.x = this.enemy.x - (this.enemy.width);
            this.enemyState.y = this.enemy.y - (this.enemy.height * 3);

            this.facing.setText('Enemy: ' + this.enemy.body.facing);
            this.facingPlayer.setText('Player: ' + this.player.body.facing);
            this.playerState.setText(this.player.currState());
            this.enemyState.setText(this.enemy.currState());
        }

        this.player.update(this);
        this.enemy.update(this, this.player);

        // go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select_2');
            this.scene.start('menuScene');
        }

    }
}
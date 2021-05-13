class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('test_player', "./assets/test_player.png");

        this.load.spritesheet('enemy1','./assets/enemySpriteSheet.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 14,
            repeat: -1
        });
    }

    create() {
        
        // Create Controls for Player
        this.cursors = this.input.keyboard.createCursorKeys();
        this.add.text(1, 0, "Play Scene");

        // Make Animations
        this.anims.create({
            key: 'enemyIdle',
            frames: this.anims.generateFrameNumbers('enemy1', { frames: [ 0, 1, 2, 3, 4, 5] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'enemyPunch',
            frames: this.anims.generateFrameNumbers('enemy1', { frames: [ 6, 7, 8, 9, 10, 11, 12, 13] }),
            frameRate: 10,
            repeat: -1
        });

        this.player = new Player(this, game.config.width/3, game.config.height/2, 'test_player');
        this.enemy = new Enemy(this,game.config.width - game.config.width/3, game.config.height/2, 'enemy1');

        this.time.addEvent({ delay: 500, callback: this.goToEnemy, callbackScope: this, loop: true});
        
    }

    goToEnemy(){
        this.physics.accelerateToObject(this.enemy, this.player, 250, 120, 120);
    }

    update() {
        this.player.update();
        this.enemy.update();
    }
}
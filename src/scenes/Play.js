class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('test_player', "./assets/test_player.png");
    }

    create() {
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.add.text(1, 0, "Play Scene");

        this.player = new Player(this, game.config.width/2, game.config.height/2, 'test_player');

    }

    update() {
        this.player.update();
    }
}
class Credits extends Phaser.Scene{
    constructor() {
        super("credits");
    }

    create() {        

        this.credits = this.add.image(game.config.width/2, game.config.height/2, 'credits').setOrigin(0.5, 0.5).setAlpha(1);
        this.credits.displayWidth = game.config.width;
        this.credits.displayHeight = game.config.height;
        
        
        this.input.keyboard.on('keydown-BACKSPACE',() => {
            this.scene.start('menuScene');
        });
        

    }

}
class InsertCoin extends Phaser.Scene{
    constructor() {
        super("coinScene");
    }

    create() {        
        
        this.insertedCoin = false;
        this.doOnce = true;

        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.skyline = this.add.image(game.config.width/2, game.config.height/2, 'skyline').setOrigin(0.5, 0.5).setAlpha(0);
        this.skyline.displayWidth = game.config.width;
        this.skyline.displayHeight = game.config.height;

        this.clouds = this.add.tileSprite(0, 0, game.config.width, game.config.height,
            'clouds').setOrigin(0,0).setAlpha(0);

        this.menuTitle = this.add.image(game.config.width/2, game.config.height/2, 'wallStreetFighter').setOrigin(0.5, 0.5);
        this.menuTitle.displayWidth = 600;
        this.menuTitle.displayHeight = 300;
        

        this.insertCoin = this.add.text(game.config.width/2, game.config.height/2 + game.config.height/2.5, "INSERT COIN", 'Lucida Sans Unicode').setOrigin(0.5, 0.5);
        this.insertCoin.setFontSize(20);
        
        this.input.keyboard.on('keydown',() => {this.insertedCoin = true;});
        this.flash = this.plugins.get('rexflashplugin').add(this.insertCoin, {
            duration: 1000,
            repeat: -1
        });
        this.flash.flash();

        // TWEENS TO START THE SCENE
        this.moveTitle = this.tweens.add({
            targets: this.menuTitle,
            y: 130,
            x: game.config.width/2,
            scale: 3,
            duration: 3000,
            ease: 'Sine.easeInOut',
            paused: true, 
            onComplete: () => {this.scene.start('menuScene')}
        });

        this.alphaSkyline = this.tweens.add({
            targets: [this.clouds, this.skyline],
            alpha: 1,
            duration: 3000,
            ease: 'Sine.easeIn',
            paused: true,
        });

    }


    update() {

        if(this.insertedCoin && this.doOnce){
            this.doOnce = false;
            this.flash.stop();
            this.insertCoin.destroy();
            this.moveTitle.play();
            this.alphaSkyline.play();
        }

        if (Phaser.Input.Keyboard.JustDown(keyP)){
			this.scene.start('playScene');
		}

    }
}
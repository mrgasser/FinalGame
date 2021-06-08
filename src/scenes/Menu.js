class Menu extends Phaser.Scene{
    constructor() {
        super("menuScene");

        
    }

    create() {        

        this.buttons = [];
	    this.selectedButtonIndex = 0;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.skyline = this.add.image(game.config.width/2, game.config.height/2, 'skyline').setOrigin(0.5, 0.5);
        this.skyline.displayWidth = game.config.width;
        this.skyline.displayHeight = game.config.height;

        this.clouds = this.add.tileSprite(0, 0, game.config.width, game.config.height,
            'clouds').setOrigin(0,0).setAlpha(1);
        
        // WALLSTREET FIGHTER TITLE
        this.menuTitle = this.add.image(game.config.width/2, 130, 'wallStreetFighter').setOrigin(0.5, 0.5);
        this.menuTitle.displayWidth = 600;
        this.menuTitle.displayHeight = 300;
        this.menuTitle.setScale(3);

        // BUTTONS CONFIG
        let config = {
            fontFamily: 'mainFont',
            fontSize: '15px',
            //color: '#000000',
            align: 'right',
            // padding: {
            // top: 5,
            // bottom: 5,
            // }
        }

        //CREATE THE BUTTONS & SELECTOR
        this.buttonSelector = this.add.rectangle(100, 100, 10, 10, 0xFFFFFF);
        this.playButtonText = this.add.text(game.config.width/2, game.config.height/2 + 70, "GAME START", config);
        this.tutorialButtonText = this.add.text(game.config.width/2, this.playButtonText.y + 35, "CREDITS", config);

        //PUSH BUTTONS TO ARRAY
        this.buttons.push(this.playButtonText);
	    this.buttons.push(this.tutorialButtonText);

        // START BUTTONS AT 0 INDEX
        this.selectButton(0);

        // START SCENES IF SELECTED
        this.playButtonText.on('selected', () => {
            this.sound.play('sfx_select_2');
            this.cameras.main.fadeOut(1000);
        });

        this.tutorialButtonText.on('selected', () => {
            this.scene.start('credits');
        });

        this.cameras.main.on("camerafadeoutcomplete", () => {
            this.menuTheme.stop();
            this.scene.start('tutorialScene');
        });
        
        //TURNING OFF EVENTS
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.playButtonText.off('selected');
            this.tutorialButtonText.off('selected');
        });

        var musicConfig = {
            mute: false,
            //volume: 0.5,
            rate: 1,
            //detune: 2,
            seek: 0,
            loop: true,
            delay: 0
        }
        
        if(!this.menuTheme){
            this.menuTheme = this.sound.add("menuBeat");
            this.menuTheme.play(musicConfig);
        }
        
        
        
        
            
    }


    update() {

        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

        this.clouds.tilePositionX -= 0.5;

        if (upJustPressed){
			this.selectNextButton(-1);
		}
		else if (downJustPressed){
			this.selectNextButton(1);
		}
		else if (spaceJustPressed){
			this.confirmSelection();
		}

        
    }

    selectButton(number){
        const currentButton = this.buttons[this.selectedButtonIndex];
        // Setting to white tint
        currentButton.setTint(0xffffff);
        const button = this.buttons[number];
        button.setTint(0x66ff7f);

        this.buttonSelector.x = button.x - 30;
        this.buttonSelector.y = button.y + 10;

        this.selectedButtonIndex = number;
    }

    selectNextButton(change = 1){
        let index = this.selectedButtonIndex + change;

        if(index >= this.buttons.length){
            index = 0;
        }
        else if(index < 0){
            index = this.buttons.length - 1;
        }

        this.selectButton(index);
    }

    confirmSelection(){
        let button = this.buttons[this.selectedButtonIndex];
        button.emit('selected');
    }
}
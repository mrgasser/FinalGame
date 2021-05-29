class Menu extends Phaser.Scene{
    constructor() {
        super("menuScene");

        
    }

    create() {        

        this.buttons = [];
	    this.selectedButtonIndex = 0;

        this.cursors = this.input.keyboard.createCursorKeys()
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.skyline = this.add.image(game.config.width/2, game.config.height/2, 'skyline').setOrigin(0.5, 0.5);
        this.skyline.displayWidth = game.config.width;
        this.skyline.displayHeight = game.config.height;

        this.menuTitle = this.add.image(600, 120, 'wallStreetFighter').setOrigin(0.5, 0.5);
        this.menuTitle.displayWidth = 600;
        this.menuTitle.displayHeight = 300;
        this.menuTitle.setScale(2.5);

        //CREATE THE BUTTONS & SELECTOR
        this.buttonSelector = this.add.rectangle(100, 100, 10, 10, 0xFFFFFF);
        this.playButtonText = this.add.text(game.config.width/2 + game.config.width/6, game.config.height/2 + 40, "GAME START", 'Lucida Sans Unicode');
        this.tutorialButtonText = this.add.text(game.config.width/2 + game.config.width/6, this.playButtonText.y + 35, "CREDITS", 'Lucida Sans Unicode');

        //PUSH BUTTONS TO ARRAY
        this.buttons.push(this.playButtonText);
	    this.buttons.push(this.tutorialButtonText);

        // START BUTTONS AT 0 INDEX
        this.selectButton(0);

        // START SCENES IF SELECTED
        this.playButtonText.on('selected', () => {
            console.log('play');
            this.sound.play('sfx_select_2');
            this.scene.start('playScene');
        });

        this.tutorialButtonText.on('selected', () => {
            console.log('tutorial')
        });

        //TURNING OFF EVENTS
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.playButtonText.off('selected');
            this.tutorialButtonText.off('selected');
        })

    }


    update() {

        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
		const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

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
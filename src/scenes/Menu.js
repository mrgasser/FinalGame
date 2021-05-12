class Menu extends Phaser.Scene{
    constructor() {
        super("menuScene");
    }

    create() {
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.add.text(0, 0, "MENU").setOrigin(0, 0);
    }

    update() {

        // Start playscene
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('playScene'); 
        }
    }
}
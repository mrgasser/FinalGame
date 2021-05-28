class Menu extends Phaser.Scene{
    constructor() {
        super("menuScene");
    }

    create() {
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(0, 0, "MENU").setOrigin(0, 0);
        this.add.text(game.config.width/2, game.config.height/2, "Press Space for Play Scene").setOrigin(0.5);
    }

    update() {

        // Start playscene
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('sfx_select_2');
            this.scene.start('playScene');
        }
    }
}
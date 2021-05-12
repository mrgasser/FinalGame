// Game configuration
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,

    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    autoCenter: true,
    pixelArt: true,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// set the UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Reserve Keys
let keySPACE;

let cursors;
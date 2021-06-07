// Punch Sound effect
// https://mixkit.co/free-sound-effects/punch/

// Game configuration
let config = {
    type: Phaser.CANVAS,
    width: 840,
    height: 480,
    pixelArt: true,
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
    
    scene: [Load, InsertCoin, Tutorial, Menu, Play]
}

let game = new Phaser.Game(config);

// set the UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Reserve Keys
let keySPACE, keyR, keyO, keyP;
let score = 0;

let cursors;
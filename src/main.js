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
    
    scene: [Load, InsertCoin, Tutorial, Menu, Credits, Play]
}

let game = new Phaser.Game(config);

let play_Player;

// set the UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}

// Reserve Keys
let keySPACE, keyR, keyO, keyP, keyUP;
let score = 0;

let cursors;
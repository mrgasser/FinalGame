// Game configuration
let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 540,

    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    autoCenter: true,
    pixelArt: true,
    scene: [Menu, Play, Credits, Information]
}

let game = new Phaser.Game(config);
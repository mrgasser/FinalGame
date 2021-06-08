class Load extends Phaser.Scene{
    constructor(){
        super("loadScene");
    }

    preload(){
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBar.x = 240;
        progressBox.x = 240;
        progressBar.y = 80;
        progressBox.y = 80;
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        var width = game.config.width;
        var height = game.config.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.scene.start('coinScene');
        });

        // PLUGINS
        this.load.plugin('rexflashplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexflashplugin.min.js', true);

        

        // LOAD IMAGES
        this.load.image('wallStreetFighter', './assets/images/menuTitle.png');
        this.load.image('skyline', './assets/images/MenuBackground.png');
        this.load.image('lobby', './assets/images/HotelLobbyv1.png');
        this.load.image('checkmark', './assets/checkMark.png');
        this.load.image('upArrow', './assets/upArrow.png');
        this.load.image('clouds', './assets/images/CloudsParallax.png');

        this.load.image('credits', './assets/Credits.png');

        this.load.image('walkPrompt', './assets/walkPrompt.png');
        this.load.image('punchPrompt', './assets/PunchPrompt.png');
        this.load.image('superPrompt', './assets/SuperPunchPrompt.png');

        this.load.image('pentLayer1', "./assets/PenthousevLayer1.png");
        this.load.image('pentLayer2', "./assets/PenthousevLayer2.png")

        // LOAD AUDIO
        this.load.audio('sfx_select_2', './assets/audio/selectSFX_2.wav');
        this.load.audio('tutorialBeat', './assets/audio/datTutorial.wav');
        this.load.audio('menuBeat', './assets/audio/titleScreenTypeBeat.wav');
        this.load.audio('playBeat', './assets/audio/mainBeat.wav');
        this.load.audio('sfx_punch', './assets/audio/punch.wav');
        this.load.audio('sfx_gameOver', './assets/audio/gameOver.wav');
        this.load.audio('sfx_gettingHit', "./assets/audio/gettingHit.wav");
        this.load.audio("enemyPunch1", './assets/audio/enemyPunch.wav');
        this.load.audio('enemyPunch2', './assets/audio/enemyPunch2.wav');

        // LOAD FONT
        loadFont("mainFont", "./assets/fonts/mainFont.ttf");


        // LOAD SPRITESHEETS
        this.load.spritesheet('the_receptionist', "./assets/Enemies/receptionist.png", {
            frameWidth: 64,
            frameHeight: 55,
            startFrame: 0,
            endFrame: 29,
            repeat: -1
        });

        this.load.spritesheet('main_player', "./assets/Main_Character/mainPlayer.png", {
            frameWidth: 46,
            frameHeight: 46,
            startFrame: 0,
            endFrame: 15,
            repeat: -1
        });

        this.load.spritesheet('enemy1','./assets/enemySprite.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 18,
            repeat: -1
        });
        this.load.spritesheet('main_player_test','./assets/FinalCharacter.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 19,
            repeat: -1
        });

    }
}
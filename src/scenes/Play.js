class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    create() {

        this.gameFloor = this.add.rectangle(0, game.config.height - 10, game.config.width, 50, 0xf0df0f).setOrigin(0);
        this.physics.world.enable(this.gameFloor);
        this.gameFloor.body.setImmovable();

        // Text for scene
        //this.cursors = this.input.keyboard.createCursorKeys();
        this.add.text(1, 0, "Play Scene");
        this.facing = this.add.text(0, 15, '', { font: '16px Courier', fill: '#00ff00' });
        this.facingPlayer = this.add.text(0, 30, '', { font: '16px Courier', fill: '#00ff00' });
        this.playerState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        this.enemyState = this.add.text(0, 45, '', { font: '16px Courier', fill: '#00ff00' });
        this.punched = this.add.text(game.config.width/2, game.config.height/2, 'Arrow keys to move \n Space to punch \n Hold Space for powerful punch', { font: '16px Courier', fill: '#ffffff', align: 'center' }).setOrigin(0.5);
        
        // Return to menu configuration
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.add.text(game.config.width/2, 20, "Press R to return to Menu").setOrigin(0.5);

        // Make Animations
        this.anims.create({
            key: 'recepIdle',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 0, end: 7}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'recepStun',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 8, end: 11}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'recepKnocked',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 12, end: 13}),
            frameRate: 2,
            //repeat: -1
        });

        this.anims.create({
            key: 'recepLaydown',
            frames: this.anims.generateFrameNumbers('the_receptionist', {start: 18}),
            //frameRate: 10,
            //repeat: -1
        });

        // this.anims.create({
        //     key: 'recepWalk',
        //     frames: this.anims.generateFrameNumbers('the_receptionist', {start: 14, end: 17}),
        //     frameRate: 8,
        //     repeat: -1
        // });
        // this.anims.create({
        //     key: 'recepPunch',
        //     frames: this.anims.generateFrameNumbers('the_receptionist', {start: 6, end: 13}),
        //     frameRate: 25,
        //     repeat: -1
        // });

        // Initialize all the different groups
        this.hitboxes = this.physics.add.group();
        this.physics.world.enable(this.hitboxes);

        this.knockHitboxes = this.physics.add.group();
        this.physics.world.enable(this.knockHitboxes);

        this.enemyHitboxes = this.physics.add.group();
        this.physics.world.enable(this.enemyHitboxes);

        this.enemyGroup = this.physics.add.group();
        this.physics.world.enable(this.enemyHitboxes);

        // Initialize the prefabs in the scene
        this.player = new Player(this, game.config.width/3, game.config.height - 100, 'main_player');
        this.enemy = new Enemy(this,game.config.width - game.config.width/3, game.config.height/2, 'the_receptionist');
        
        
        //this.leftSide = this.add.circle(this.player.x, this.player.y, 30, 30, 0xFFFFFF);
        //this.rightSide = this.add.circle(this.player.x, this.player.y, 30, 30, 0xFFFFFF);
        

        // Physics Collisions
        this.physics.add.collider(this.enemy, this.gameFloor);
        this.physics.add.collider(this.player, this.gameFloor);

        // Scene Camera Test
        this.input.keyboard.on('keydown-O', this.moveCam.bind(this));
    }

    moveCam(){
        this.cameras.main.pan(game.config.width/2, -game.config.height * 2, 10000);
        this.cameras.main.on('pancomplete', () => {console.log("finished pan");});
    }

    update() {

        //Debug stuff
        {
            this.playerState.x = this.player.body.x;
            this.playerState.y = this.player.body.y - 20;
            this.enemyState.x = this.enemy.body.x;
            this.enemyState.y = this.enemy.body.y - 20;

            this.facing.setText('Enemy: ' + this.enemy.body.facing);
            this.facingPlayer.setText('Player: ' + this.player.body.facing);
            this.playerState.setText(this.player.currState());
            this.enemyState.setText(this.enemy.currState());
        }

        // make circle follow player
        //this.leftSide.x = this.player.x - 200;
        //this.leftSide.y = this.player.y;

        //this.rightSide.x = this.player.x + 200;
        //this.rightSide.y = this.player.y;


        this.player.update(this);
        this.enemy.update(this, this.player);

        // go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select_2');
            this.scene.start('menuScene');
        }

    }
}
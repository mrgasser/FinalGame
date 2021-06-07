class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.displayHeight = 150;
        this.displayWidth = 150;

        // Physics Properties
        this.setCollideWorldBounds(true);
        this.body.setSize(25, this.height, true);
        this.setGravityY(2000);

        // Variables for character
        this.scene = scene;
        this.power = 0;
        this.looking = 'right';
        this.healthBar = new HealthBar(scene, 75, 5);

        // Physics Variables
        this.VELOCITY = 200;
        this.ACCELERATION = 1000;
        this.MAX_X_VEL = 100;
        this.MAX_Y_VEL = 100; 
        this.MAX_JUMPS = 2;
        this.JUMP_VELOCITY = -500;
        this.DRAG = 800;

        // Types of hitbox
        this.regularPunch = {
            offset_x: 40,
            offset_y: 0,
            width: 100,
            height: 40,
            hitbox: 'regular'
        }

        this.powerfulPunch = {
            offset_x: 40,
            offset_y: 0,
            width: 100,
            height: 40,
            hitbox: 'knock'
        }

        // Set controls for Player
        this.cursors = scene.input.keyboard.createCursorKeys();
        keySPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set different states
        this.state = {
            isHit: false,
            isMoving: false,
            isKnocked: false,
            isAttacking: false,
        }

        // Set Anims
        scene.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNumbers('main_player', {start: 0, end: 7}),
            frameRate: 15,
            //repeat: -1
        });
        scene.anims.create({
            key: 'playerWalk',
            frames: this.anims.generateFrameNumbers('main_player', {start: 8, end: 11}),
            frameRate: 8,
            //repeat: -1
        });
        scene.anims.create({
            key: 'playerPunch',
            frames: this.anims.generateFrameNumbers('main_player', {start: 12, end: 15}),
            frameRate: 30,
            //repeat: -1
        });
        
        // Combo punch and charge punch logic
        this.lastTime = 0;
        scene.input.keyboard.on('keydown-SPACE', this.startPunch.bind(this));
        scene.input.keyboard.on('keyup-SPACE', this.endPunch.bind(this));
        
    }

    endPunch(){

        this.clickDelay = this.scene.time.now - this.lastTime;
        this.lastTime = this.scene.time.now;
        
        if(this.timer){
            this.timer.remove();
        }

        // POWERFUL PUNCH
        if(this.power >= 5){
            this.usePunch(this.scene, 400, this.powerfulPunch);
            this.y -= 1;
        }
        // FASTER PUNCH
        else if(this.clickDelay < 250){
            this.usePunch(this.scene, 120, this.regularPunch);
        }
        //REGULAR PUNCH
        else{
            this.usePunch(this.scene, 200, this.regularPunch);
        }
        
        this.displayHeight = 150;
        this.displayWidth = 150;
        this.VELOCITY = 200;
        this.power = 0;
    }

    tick(){
        if (this.power < 5) {
            this.power += 1;
            this.displayHeight -= 1;
            this.displayWidth += .5;
            this.VELOCITY -= 10;
            this.setTintFill(0xFFFFFF);
            //console.log(this.power);
        }
    }

    startPunch(){        
        this.timer = this.scene.time.addEvent({
            delay: 100,
            callback: this.tick,
            callbackScope: this,
            loop: true
        });
    }

    update(scene) {

        //Check keyboard input for movement
        if(!this.state.isAttacking){
            if(this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.body.velocity.x = -this.VELOCITY;
                this.looking = 'left';
                this.state.isMoving = true;
                this.play('playerWalk', true);
                this.setFlip(true, false);
            } else if(this.cursors.right.isDown && !this.cursors.left.isDown) {
                this.body.velocity.x = this.VELOCITY;
                this.looking = 'right';
                this.state.isMoving = true;
                this.play('playerWalk', true);
                this.resetFlip();
            } else {
                this.state.isMoving = false;
                this.body.setAccelerationX(0);
                this.body.setDragX(this.DRAG);
                this.anims.play('playerIdle', true);
            }
        }

        if (this.state.isAttacking) {
            this.body.velocity.x = 0;
        }

    }

    usePunch(scene, delay, type){

        return new Promise( async (resolve, reject) => {
            //Check if theyre not already attacking so they cant spam
            if(!this.state.isAttacking){
                this.state.isAttacking = true;
                this.play('playerPunch');

                setTimeout( () => {
                    // checks which direction player is facing to spawn punch hitbox
                    if (this.looking == 'left') {
                        this._spawnHitbox(this.looking, type);
                    } 
                    else{
                        this._spawnHitbox(this.looking, type);
                    }
                    scene.sound.play('sfx_punch');
                }, 100);

                setTimeout( () => {
                    this.punch.destroy();
                    this.state.isAttacking = false;
                }, delay);

                return resolve();
            }
        });

    }

    _spawnHitbox(direction, type){
        if(direction == 'left'){
            this.punch = this.scene.add.rectangle(this.x - type.offset_x, this.y - type.offset_y, type.width, type.height, 0xffffff).setAlpha(0);
        }
        else{
            this.punch = this.scene.add.rectangle(this.x + type.offset_x, this.y - type.offset_y, type.width, type.height, 0xffffff).setAlpha(0);
        }
        this.scene.physics.add.existing(this.punch);

        if(type.hitbox == 'regular'){
            this.scene.hitboxes.add(this.punch);
        }
        else if(type.hitbox == 'knock'){
            this.scene.knockHitboxes.add(this.punch);
        }
    }

    currState(){
        if(this.state.isHit){
            return "IsHitting";
        }
        else if(this.state.isAttacking){
            return "IsAttacking";
        }
        else if(this.state.isMoving){
            return "IsMoving"
        }
        else{
            return "Idle";
        }
        
    }

}
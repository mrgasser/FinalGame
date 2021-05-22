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

        // Physics Variables
        this.VELOCITY = 200;
        this.ACCELERATION = 1000;
        this.MAX_X_VEL = 100;
        this.MAX_Y_VEL = 100; 
        this.MAX_JUMPS = 2;
        this.JUMP_VELOCITY = -500;
        this.DRAG = 800;

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
            frameRate: 15,
            //repeat: -1
        });

        
    }

    update(scene) {

        //Check keyboard input for movement
        if(!this.state.isAttacking){
            if(this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.body.velocity.x = -this.VELOCITY;
                this.state.isMoving = true;
                this.play('playerWalk', true);
                //this.body.setSize(this.width, this.height, true);
                this.setFlip(true, false);
            } else if(this.cursors.right.isDown && !this.cursors.left.isDown) {
                this.body.velocity.x = this.VELOCITY;
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
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.usePunch(scene);
        }
        if (this.state.isAttacking) {
            this.body.velocity.x = 0;
        }

    }

    usePunch(scene){

        return new Promise( async (resolve, reject) => {
            //Check if theyre not already attacking so they cant spam
            if(!this.state.isAttacking){
                this.state.isAttacking = true;
                this.play('playerPunch');
                setTimeout( () => {
                    // checks which direction player is facing to spawn punch
                    if (this.body.facing == 13) {
                        this.punch = scene.add.rectangle(this.x - 40, this.y, 100, 40, 0xffffff).setAlpha(0);
                        scene.physics.add.existing(this.punch);
                        scene.hitboxes.add(this.punch);
                    } else{
                        this.punch = scene.add.rectangle(this.x + 40, this.y, 100, 40, 0xffffff).setAlpha(0);
                        scene.physics.add.existing(this.punch);
                        scene.hitboxes.add(this.punch);
                    }
                    //this.punch.setActive(true);
                    //this.punch.setVisible(true);
                    scene.sound.play('sfx_punch');
                    
                }, 200);
                setTimeout( () => {
                    this.punch.destroy();
                    this.state.isAttacking = false;
                }, 300);
                return resolve();
            }
        });

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
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.displayHeight = 50;
        this.displayWidth = 50;

        // Physics Properties
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width, this.height, true);
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
            isKnocked: false,
            isAttacking: false
        }

        this.setHitboxes(scene);
        
    }

    setHitboxes(scene){
        //this.setHitboxes(scene);
        //this.punch = scene.add.rectangle(200, 100, 50, 30, 0xffffff);
        // scene.add.existing(this.punch);
        // scene.physics.add.existing(this.punch);
        // scene.hitboxes.add(this.punch);
        // this.punch.setActive(false);
        // this.punch.setVisible(false);
    }

    update(scene) {

        //Check keyboard input
        if(this.cursors.left.isDown) {
            this.body.velocity.x = -this.VELOCITY;
            this.setFlip(true, false);
        } else if(this.cursors.right.isDown) {
            this.body.velocity.x = this.VELOCITY;
            this.resetFlip();
        } else {
            // set acceleration to 0 so DRAG will take over
            //this.play('test_player');
            this.body.setAccelerationX(0);
            this.body.setDragX(this.DRAG);
            //this.anims.play('turn');
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
            if(!this.state.isAttacking){
                
                // checks which direction player is facing to spawn punch
                if (this.body.facing == 14) {
                    this.punch = scene.add.rectangle(this.x + 20, this.y, 50, 30, 0xffffff);
                } else if (this.body.facing == 13) {
                    this.punch = scene.add.rectangle(this.x - 20, this.y, 50, 30, 0xffffff);
                }
                this.punch.setActive(true);
                this.punch.setVisible(true);
                this.state.isAttacking = true;
                this.play('enemyPunch');
                setTimeout( () => {
                    //this.punch.disableBody(true,true);
                    this.punch.setActive(false);
                    this.punch.setVisible(false);
                    this.state.isAttacking = false;
                }, 200);
                return resolve();
            }
        });

    }

}
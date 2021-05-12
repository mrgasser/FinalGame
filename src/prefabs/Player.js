class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Physics Properties
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width, this.height, true);
        this.setGravityY(2000);

        // Physics Variables
        this.ACCELERATION = 1000;
        this.MAX_X_VEL = 100;
        this.MAX_Y_VEL = 100; 
        this.MAX_JUMPS = 2;
        this.JUMP_VELOCITY = -500;
        this.DRAG = 500;

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update(scene) {

        //this.body.setVelocityX(100);
        //Check keyboard input
        if(this.cursors.left.isDown) {
            this.body.setAccelerationX(-this.ACCELERATION);
            this.setFlip(true, false);
        } else if(this.cursors.right.isDown) {
            this.body.setAccelerationX(this.ACCELERATION);
            this.resetFlip();
        } else {
            // set acceleration to 0 so DRAG will take over
            this.body.setAccelerationX(0);
            this.body.setDragX(this.DRAG);
        }

    }
}
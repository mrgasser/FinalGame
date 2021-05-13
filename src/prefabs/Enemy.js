class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.displayHeight = 50;
        this.displayWidth = 50;

        this.play('enemyWalk');

        // Physics Properties
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width, this.height, true);
        this.setGravityY(2000);

    }

    create(){

    }

    update(scene){
        if(this.body.facing == 13){
            this.setFlip(true, false);
        }
        if(this.body.facing == 14){
            this.resetFlip();
        }
        //console.log(scene.body.FACING_LEFT);
    }
}
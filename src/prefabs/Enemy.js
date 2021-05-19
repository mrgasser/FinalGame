class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.displayHeight = 150;
        this.displayWidth = 150;

        

        // Physics Properties
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width, this.height, true);
        this.setGravityY(2000);

        this.play('enemyWalk');

        // Set different states
        this.state = {
            isStunned: false,
            isStunned2: false,
            isStunned3: false,
            isMoving: false,
            isKnocked: false,
            isAttacking: false,
        }

        //collisions
        scene.physics.add.overlap(scene.hitboxes, this, this.enemyStun, null);

    }

    update(scene, player){
        if(this.body.facing == 13){
            this.setFlip(true, false);
        }
        if(this.body.facing == 14){
            this.resetFlip();
        }

        if(this.state.isStunned){
            this.body.stop();
        }

        if(!this.state.isStunned){
            this.state.isMoving = true;
            scene.physics.accelerateToObject(this, player, 600, 120, 2000);
        }
    }


    enemyStun(obj1){

        return new Promise( async (resolve, reject) => {

            if(!obj1.hasOverlapped){
                obj1.state.isMoving = false;
                obj1.state.isStunned = true;
                obj1.hasOverlapped = true;

                setTimeout( () => {
                    obj1.hasOverlapped = false;
                }, 300);

                // if(obj1.hasOverlapped){
                //     console.log("wassup");
                // }

                setTimeout( () => {
                    obj1.state.isStunned = false;
                }, 1000);
            }

            return resolve();
        });
        
    }

    currState(){
        if(this.state.isStunned){
            return "IsStunned";
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
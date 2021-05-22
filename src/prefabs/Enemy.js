class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.displayHeight = 150;
        this.displayWidth = 170;

        // Physics Properties
        this.setCollideWorldBounds(true);
        this.body.setSize(25, this.height, true);
        this.setGravityY(2000);

        // Enemys own variables
        this.scene = scene;
        this.health = 100;
        this.playerLooking = 0;
        

        // CREATE THE STATEMACHINE
        this.fsm = {
            scope: this
        }
        StateMachine.apply(this.fsm, {
            init: 'idle',
            transitions: [
              { name: 'punched',  from: 'idle',  to: 'stunned' },
              { name: 'punched2',  from: 'stunned',  to: 'stunned2' },
              { name: 'punched3',  from: 'stunned2',  to: 'stunned3' },
              { name: 'knockedPunch',  from: 'stunned3',  to: 'knocked' },
              { name: 'stunTimerFinished',  from: ['stunned', 'stunned2', 'stunned3'],  to: 'idle' },
              
              { name: 'knockTimerFinished',  from: 'knocked',  to: 'layingDown' },
              { name: 'layTimerFinished',  from: 'layingDown',  to: 'idle' },
              { name: 'healthBelowZero',  from: 'layingDown',  to: 'die' },
              
              
            ],
            methods: {
                onIdle: this._onIdle,
                onStunned: this._onStunned,
                onEnterKnocked: this._onEnterKnocked,
                onLayingDown: this._onLayingDown,
            }
          });
        
        //Cooldown countdown
        //this.scene.timerLabel = this.scene.add.text(0, 60, 'HELLO', { font: '16px Courier', fill: '#00ff00' });
        this.stunCountdown = new CountdownController(scene, null, 1500);
        this.knockCountdown = new CountdownController(scene, null, 800);
        this.laydownCountdown = new CountdownController(scene, null, 2000);
        
        //collisions
        scene.physics.add.overlap(scene.hitboxes, this, this.enemyStun.bind(this), null);
    }

    _onIdle(){
        console.log("onIdle");
        this.scope.play('recepIdle');
    }

    _onStunned(){
        console.log("onStunned");
        this.scope.body.stop();
        this.scope.stop();

        this.scope.play('recepStun', true);
    }

    _onEnterKnocked(){
        if(this.scope.playerLooking == 14){
            this.scope.setBounce(0.8,0.8);
            this.scope.body.velocity.x = 300;
            this.scope.body.velocity.y = 800;
        }
        else{
            this.scope.setBounce(0.8,0.8);
            this.scope.body.velocity.x = -300;
            this.scope.body.velocity.y = 800;
        }
        this.scope.play('recepKnocked', true);
        this.scope.knockCountdown.start(this.scope.handleFinishedKnocked.bind(this));
    }

    _onLayingDown(){
        this.scope.play('recepLaydown', true);
        this.scope.laydownCountdown.start(this.scope.handleFinishedLayingDown.bind(this));
    }

    handleFinishedStun(){
        if(this.fsm.can('stunTimerFinished')){
            console.log("stunTimerRanOut");
            this.fsm.stunTimerFinished();
        }
    }

    handleFinishedKnocked(){
        this.scope.setBounce(0);
        this.scope.setDrag(200,0);
        this.scope.fsm.knockTimerFinished();
    }

    handleFinishedLayingDown(){
        if(this.scope.health <= 0){
            this.scope.fsm.healthBelowZero();
        }
        else{
            this.scope.fsm.layTimerFinished();
        }
    }

    update(scene, player){
        if(this.body.facing == 13){
            this.setFlip(true, false);
        }
        if(this.body.facing == 14){
            this.resetFlip();
        }

        this.playerLooking = player.body.facing;
    }

    enemyStun(){
        
        return new Promise( async (resolve, reject) => {

            if(!this.hasOverlapped){
                this.stunCountdown.start(this.handleFinishedStun.bind(this));

                if(this.fsm.can('knockedPunch')){
                    this.fsm.knockedPunch();
                }
                else if(this.fsm.can('punched2')){
                    this.fsm.punched2();
                }
                else if(this.fsm.can('punched3')){
                    this.fsm.punched3();
                }
                else if(this.fsm.can('punched')){
                    this.fsm.punched();
                }
                this.hasOverlapped = true;

                setTimeout( () => {
                    this.hasOverlapped = false;
                }, 300);

            }

            return resolve();
        });
        
    }

    keepDistance(scene, player){
        if(this.x < player.body.x + 50){
            this.state.isMoving = true;
            scene.physics.accelerateToObject(this, scene.farRange, 1000, 120, 2000);   
        }
    }

    currState(){
        return "is-" + this.fsm.state;
    }
}
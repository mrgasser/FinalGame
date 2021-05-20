class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.displayHeight = 150;
        this.displayWidth = 150;

        // Save Passed Over Variables
        this.scene = scene;

        // Physics Properties
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width, this.height, true);
        this.setGravityY(2000);

        // CREATE THE STATEMACHINE
        this.fsm = {
            scope: this
        }
        StateMachine.apply(this.fsm, {
            init: 'idle',
            transitions: [
              { name: 'punched',  from: 'idle',  to: 'stunned' },
              { name: 'stunTimerFinished',  from: 'stunned',  to: 'idle' }
            ],
            methods: {
                onIdle: this._onIdle,
                onStunned: this._onStunned
            }
          });
          
        // Initialize the FSM
        // this.fsm = new StateMachine({
        //     init: 'idle',
        //     transitions: [
        //       { name: 'punched',  from: 'idle',  to: 'stunned' },
        //       { name: 'stunTimerFinished',  from: 'stunned',  to: 'idle' }
        //     ],
        //     methods: {
        //         onEnterIdle: function() { console.log(this)},
        //         //onPunched: function() { console.log('Got Punched')},
        //         onStunned: function() { console.log('Im Stunned')}
        //         //onRecover: function() { console.log('Im Recovering')}
        //     }
        // });
        //collisions
        this.scene.timerLabel = this.scene.add.text(0, 60, 'HELLO', { font: '16px Courier', fill: '#00ff00' });
        
        this.stunCountdown = new CountdownController(scene, scene.timerLabel, 1500);
        
        scene.physics.add.overlap(scene.hitboxes, this, this.enemyStun.bind(this), null);
        console.log(this.stunCountdown);
    }

    _onIdle(){
        console.log("onIdle");
        this.scope.play('enemyIdle');
    }

    _onStunned(){
        console.log("onStunned");
        this.scope.body.stop();
        this.scope.stop();
    }

    handleFinishedStun(){
        console.log("finishedStun");
        this.fsm.stunTimerFinished();
    }

    update(scene, player){
        if(this.body.facing == 13){
            this.setFlip(true, false);
        }
        if(this.body.facing == 14){
            this.resetFlip();
        }

        this.stunCountdown.update();
    }

    enemyStun(){
        
        return new Promise( async (resolve, reject) => {

            if(!this.hasOverlapped){
                this.stunCountdown.start(this.handleFinishedStun.bind(this));

                if(!this.fsm.is('stunned')){
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
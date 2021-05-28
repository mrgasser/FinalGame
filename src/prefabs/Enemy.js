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
        this.playerLooking = "";
        
        // Enemy health Bar
        //this.healthBar = scene.add.rectangle(this.body.x, this.body.y - 40, 50, 10, 0x5be817).setOrigin(0, 0);
        this.healthBar = new HealthBar(scene, this.body.x, this.body.y);
        
        // this.setHealthBar();
        // scene.add.existing(this.healthBar);

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
              { name: 'goto', from: '*', to: function(s) { return s } }
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
        this.stunCountdown = new CountdownController(scene, null, 1000);
        this.knockCountdown = new CountdownController(scene, null, 900);
        this.laydownCountdown = new CountdownController(scene, null, 2000);
        
        //collisions
        scene.physics.add.overlap(scene.hitboxes, this, this.enemyStun.bind(this), null);
        scene.physics.add.overlap(scene.knockHitboxes, this, () => {
            if(!this.fsm.is('layingDown')){
                this.fsm.goto('knocked');
            }
        }, null);
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
        if(this.scope.playerLooking == 'right'){
            this.scope.setBounce(0.8,0.8);
            this.scope.body.velocity.x = 300;
            this.scope.body.velocity.y = 800;
        }
        else{
            console.log(this.scope.playerLooking);
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

        // update healthbar
        this.healthBar.update(this.body.x - 10, this.body.y - 5);

        this.playerLooking = player.looking;
    }

    enemyStun(){

        return new Promise( async (resolve, reject) => {

            if(!this.hasOverlapped){
                this.stunCountdown.start(this.handleFinishedStun.bind(this));
                this.healthBar.decrease(20); // decrease health by 20

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

    // setHealthBar() {
    //     this.healthBar.clear();
    //     console.log("Setting healthbar");
        
    //     this.healthBar.fillStyle(0xFFFFFF);
    //     this.healthBar.fillRect(this.x, this.y, 70, 20);

    //     if (this.health < 20) {
    //         this.healthBar.fillStyle(0xFF0000);
    //     } else {
    //         this.healthBar.fillStyle(0x00FF00);
    //     }

    //     let i = Math.floor(76/100 * this.health);

    //     this.healthBar.fillRect(this.x, this.y, i, 20);
    // }

    // decreaseHealth(num) {
    //     this.health -= num;

    //     if (this.health < 0) {
    //         this.health = 0;
    //     }

    //     this.setHealthBar();
    // }
}
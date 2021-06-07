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

        // The key for anims
        this.key = 'recep';

        // Enemies own variables
        this.scene = scene;
        this.health = 100;
        this.playerLooking = "";
        this.enemyLooking = "";
        this.closest = 0;
        this.furthest = 0;
        this.randomDistance = 0;

        // Timers
        this.idleCountdown = new CountdownController(scene, null, 1000);
        this.resetBuffer = new CountdownController(scene, null, 100);
        this.stunCountdown = new CountdownController(scene, null, 1000);
        this.knockCountdown = new CountdownController(scene, null, 900);
        this.laydownCountdown = new CountdownController(scene, null, 2000);
        
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
              { name: 'punched',  from: ['idle', 'patrolling', 'attack'],  to: 'stunned' },
              { name: 'punched2',  from: 'stunned',  to: 'stunned2' },
              { name: 'punched3',  from: 'stunned2',  to: 'stunned3' },
              { name: 'knockedPunch',  from: 'stunned3',  to: 'knocked' },

              { name: 'notInRange',  from: 'idle',  to: 'patrolling' },
              { name: 'finishedRandomSpot',  from: 'patrolling',  to: 'idle' },
              { name: 'inRange',  from: 'idle',  to: 'attack' },
              { name: 'finishedPunch',  from: 'attack',  to: 'idle' },

              { name: 'stunTimerFinished',  from: ['stunned', 'stunned2', 'stunned3'],  to: 'idle' },
              { name: 'knockTimerFinished',  from: 'knocked',  to: 'layingDown' },
              { name: 'layTimerFinished',  from: 'layingDown',  to: 'idle' },
              { name: 'healthBelowZero',  from: 'layingDown',  to: 'die' },
              { name: 'goto', from: '*', to: function(s) { return s } }
            ],
            methods: {
                onIdle: this._onIdle,
                onExitIdle: () => {this.idleCountdown.stop();},
                onStunned: this._onStunned,
                onEnterKnocked: this._onEnterKnocked,
                onLayingDown: this._onLayingDown,
                onPatrolling: this._onPatrolling,
                onAttack: this._onAttack,
                onDie: this._onDie,
            }
          });
                
        //collisions
        scene.physics.add.overlap(scene.hitboxes, this, this.enemyStun.bind(this), null);
        scene.physics.add.overlap(scene.knockHitboxes, this, () => {
            if(!this.fsm.is('layingDown') && !this.fsm.is('die')){
                this.fsm.goto('knocked');
            }
        }, null);

        this.flash = scene.plugins.get('rexflashplugin').add(this, {
            duration: 300,
            repeat: 5
        });

        
    }

    _onDie(){
        this.scope.flash.flash();
        this.scope.flash.on('complete', () => {
            this.scope.healthBar.bar.destroy();
            this.scope.destroy();
            score += 10;
        });
    }

    _onPatrolling(){
        // Tween stuff
        this.scope.patrolPlayer = this.scope.scene.tweens.add({
            targets: this.scope, 
            x: this.scope.x + this.scope.getRandomDistance(),
            duration: this.scope.getAppropriateTime(),
            ease: 'Linear',
            paused:true,
        });

        this.scope.patrolPlayer.on('complete', () => {
            //console.log("finished");
            this.scope.patrolPlayer.remove();
            if(this.scope.fsm.can('finishedRandomSpot')){
                this.scope.fsm.finishedRandomSpot();
            } 
        });

        this.scope.play(this.scope.key + 'Walk');
        this.scope.patrolPlayer.play();
    }

    getRandomDistance(){
        this.randomDistance = (Math.random() * (250 - 200) + 200);
        var leftEdgeScreen = 0;
        var rightEdgeScreen = game.config.width;

        var canGoLeft = (this.x - this.randomDistance) >= 0;
        var canGoRight = (this.x + this.randomDistance) <= rightEdgeScreen;

        //console.log('Left: '+ canGoLeft + ' Right: '+ canGoRight);
        //console.log('Left: '+ cantGoLeft + ' Right: '+ cantGoRight);
        if(canGoLeft && canGoRight){
            //console.log("random");
            return this.randomDistance * (Math.random() - 0.5) * 2;
        }

        else if(canGoLeft){
            //console.log("going Left");
            return -this.randomDistance;
        }

        else if(canGoRight){
            //console.log("going Right");
            return this.randomDistance;
        }

    }

    getAppropriateTime(){
        //console.log(this.randomDistance);
        return 2000;
    }

    _onIdle(){
        //console.log("onIdle");
        this.scope.play('recepIdle');
        if(this.scope.scene.player){
            var minRangeX = 150;
        }
        else{
            console.log("undefined player");
        }

        this.scope.idleCountdown.start(() => {
            
            //console.log("idle Timer ran out");
            var distanceFromPlayer = Phaser.Math.Distance.Between(this.scope.scene.player.x, this.scope.scene.player.y, this.scope.x, this.scope.y);
            
            if(distanceFromPlayer <= minRangeX){
                //console.log("in_range_x: Distance from player: " + distanceFromPlayer);
                if(this.scope.fsm.can('inRange')){
                    this.scope.fsm.inRange();
                }
            }
            else{
                //out of Range, just patrol until you get close
                //console.log("outOfRange_x: Distance from player: " + distanceFromPlayer);
                if(this.scope.fsm.can('notInRange')){
                    this.scope.fsm.notInRange();
                }
            }
        
        });
    }

    _onStunned(){
        console.log("onStunned");
        this.scope.patrolPlayer.stop();
        this.scope.idleCountdown.stop();
        
        
        this.scope.body.stop();
        this.scope.stop();

        this.scope.play('recepStun', true);
    }

    _onEnterKnocked(){
        this.scope.patrolPlayer.stop();
        if(this.scope.playerLooking == 'right'){
            this.scope.setBounce(0.8,0.8);
            this.scope.body.velocity.x = 300;
            this.scope.body.velocity.y = 800;
        }
        else{
            //console.log(this.scope.playerLooking);
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
            //console.log("stunTimerRanOut");
            this.fsm.stunTimerFinished();
        }
    }

    handleFinishedKnocked(){
        this.scope.setBounce(0);
        this.scope.setDrag(200,0);
        this.scope.fsm.knockTimerFinished();
    }

    handleFinishedLayingDown(){
        if(this.scope.healthBar.health <= 0){
            //console.log("im dead: " + this.scope.healthBar.health);
            this.scope.fsm.healthBelowZero();
        }
        else{
            //console.log("im still alive: " + this.scope.healthBar.health);
            this.scope.fsm.layTimerFinished();
        }
    }

    update(scene, player){
        if((this.x - player.x) < 0){
            this.enemyLooking = "right";
            this.setFlip(true, false);
        }
        else{
            this.enemyLooking = "left";
            this.resetFlip();
        }

        // update healthbar
        if(this.healthBar && this.body){
            this.healthBar.update(this.body.x - 10, this.body.y - 20);
        }
        //this.closest = scene.physics.closest(player);
        //this.furthest = scene.physics.furthest(player);

        this.playerLooking = player.looking;
    }

    enemyStun(){

        return new Promise( async (resolve, reject) => {

            if(!this.hasOverlapped){
                this.stunCountdown.start(this.handleFinishedStun.bind(this));
                 // decrease health by 20

                if(!this.fsm.is('layingDown') && !this.fsm.is('knocked') && !this.fsm.is('die')){
                    this.healthBar.decrease(15);

                    if(this.healthBar.health <= 0){
                        //console.log("less than zero, KNOCKED");
                        this.fsm.goto('knocked');
                    }
                }

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

    _onAttack(){

        return new Promise( async (resolve, reject) => {

            //Play the anim
            this.scope.play('recepPunch');

            setTimeout( () => {
                // checks which direction player is facing to spawn punch hitbox
                if (this.scope.enemyLooking == 'left') {
                    this.scope._spawnHitbox(this.scope.enemyLooking);
                } 
                else{
                    this.scope._spawnHitbox(this.scope.enemyLooking);
                }
                
                //play the sound
                //this.scope.scene.sound.play('sfx_punch');

            }, 100);

            setTimeout( () => {
                this.scope.punch.destroy();
                if(this.scope.fsm.can("finishedPunch")){
                    this.scope.fsm.finishedPunch();
                }
            }, 300);
            return resolve();    
        });

    }

    _spawnHitbox(direction){
        if(direction == 'left'){
            this.punch = this.scene.add.rectangle(this.x - 50, this.y - 0, 100, 40, 0xffffff).setAlpha(0);
        }
        else{
            this.punch = this.scene.add.rectangle(this.x + 50, this.y - 0, 100, 40, 0xffffff).setAlpha(0);
        }
        this.scene.physics.add.existing(this.punch);

        // if(type.hitbox == 'regular'){
        //     this.scene.hitboxes.add(this.punch);
        // }
        // else if(type.hitbox == 'knock'){
        //     this.scene.knockHitboxes.add(this.punch);
        // }
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
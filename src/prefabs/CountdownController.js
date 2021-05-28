class CountdownController extends Phaser.Time.TimerEvent {
    constructor(scene, label = null, duration){
        super(scene, label, duration);

        // Set Variables
        this.scene = scene;
        this.label = label;
        this.duration = duration;
    }

    start(callback){

        if(this.timerEvent){ this.timerEvent.reset() }
        this.stop();
        // if(scope != undefined){
        //     this.scope = scope
        // }
        //this.finishedCallback = callback;

        this.timerEvent = this.scene.time.addEvent({
            delay: this.duration,
            callback: () => {
                if(this.label != null){
                    this.label.text = '0';
                }
                this.stop();
                if(callback && this.timerEvent){
                    // if(scope != undefined){
                    //     callback().bind(this.scope);
                    // }
                    //else{
                    callback();
                    //}
                }
            }
        })
    }

    update(){
        // CHECKING IF IT EXISTS
        // VERY IMPORTANT I PULLED MY HAIR OUT FINDING THIS BUG
        if(!this.timerEvent){ return }

        const elapsed = this.timerEvent.getElapsed();
        const remaining = this.duration - elapsed;
        const seconds = remaining / 1000;

        if(this.label != null){
            this.label.text = seconds.toFixed(2);
        }
    }

    kill(){
        this.reset();
        this.destroy();
    }

    stop(){
        this.destroy();
    }
}
class HealthBar {
    constructor (scene, x, y) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.health = 100;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease (num) {
        this.health -= num;
         
        console.log(this.health);

        if (this.health < 0) {
            this.health = 0;
        } 

        this.draw();

        return (this.health === 0);
    }

    draw () {
        this.bar.clear();

        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);
 
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);
        
        if (this.health < 30) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }

        let i = Math.floor(this.p * this.health);

        this.bar.fillRect(this.x + 2, this.y + 2, i, 12);
    }

    update (x, y) {
        if(this){
            this.x = x;
            this.y = y;
            this.draw();
        }
    }

}
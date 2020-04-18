class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });
        this.score = 4;

        this.posX = 400;
        this.posY = 100;

        this.distance = 40;
    }


    preload(){
        this.load.image('process_ball','image/1.png');
    }


    create()
    {
        this.process_ball = [];
        for (let i = 0; i < 4; i++)
        {
            this.process_ball[i] = this.add.sprite(this.posX + i*this.distance, this.posY, 'process_ball');
            this.process_ball[i].setScale(2);
        }
        //  Our Text object to display the Score for debugging
        var info = this.add.text(10, 10, 'Score: 4');

        //  Grab a reference to the Controller Scene
        var Controller = this.scene.get('Controller');

        //  Listen for events from it
        Controller.events.on('addScore', function () {
            console.log("update UI bar");
            this.score--;
            
            //if the score is below zero, change to winning scene
            info.setText('Score: ' + this.score); //for debugging

            //animation to move the process ball to the right
            Controller.animation(this.process_ball[this.score], this.process_ball[this.score].x + 400, this.posY);

        }, this);
    }
}
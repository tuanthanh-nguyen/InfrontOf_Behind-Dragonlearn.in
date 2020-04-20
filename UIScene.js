class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });

        this.number_of_questions = 5;
        this.score = this.number_of_questions;
        this.check_flag = false;

        this.posX = 400;
        this.posY = 100;

        this.distance = 40;
    }


    preload(){
        this.load.image('process_ball','image/1.png');
    }


    create()
    {
        this.registry.set('score', this.score);
        this.registry.set('check_flag', this.check_flag);

        this.process_ball = [];
        for (let i = 0; i < this.number_of_questions; i++)
        {
            this.process_ball[i] = this.add.sprite(this.posX + i*this.distance, this.posY, 'process_ball');
            this.process_ball[i].setScale(2);
        }
        //  Our Text object to display the Score for debugging
        // var info = this.add.text(10, 10, 'Score: 4');

        //  Grab a reference to the Controller Scene
        var Controller = this.scene.get('Controller');

        //  Listen for events from it
        var ref = this;

        //event happens when the ball is in right dropzone
        Controller.events.on('minusScore', function () {
            //check_flag is true when no wrong answer before happens in a scene
            if( this.score > 0 && this.check_flag == false){
                ref.score--;
                
                //if the score is below zero, change to winning scene
                // info.setText('Score: ' + ref.score); //for debugging

                //animation to move the process ball to the right
                Controller.animation(ref.process_ball[ref.score], ref.process_ball[ref.score].x + 400, ref.posY);
            }
            else
                this.check_flag = false;

            this.registry.set('score', this.score);

        }, this);

        //event happens when the ball in is wrong dropzone
        Controller.events.on('addScore', function () {
            //check_flag ensure to update one time even when player keep choosing wrong
            if(this.score < 4 && this.check_flag == false){

                //if the score is below zero, change to winning scene
                // info.setText('Score: ' + ref.score); //for debugging

                //animation to move the process ball to the right
                Controller.animation(ref.process_ball[ref.score], ref.process_ball[ref.score].x - 400, ref.posY);
            
                ref.score++;

                this.check_flag = true;
            }
            else
                console.log("nothing happens"); //for debugging

            this.check_flag = true;

            this.registry.set('score', this.score);

        }, this);
    }
    destroy(){
        for(let i = 0; i < this.number_of_questions; i++){
            this.process_ball[i].destroy(true);
            this.process_ball[i] = null;
        }
    }
}
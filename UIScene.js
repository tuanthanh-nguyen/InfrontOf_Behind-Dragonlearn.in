class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });

        this.number_of_questions = 7;
        this.score = this.number_of_questions;
        this.check_flag = false;

        this.posX = 660;
        this.posY = 70;

        this.distance = 40;
        
    }


    preload(){
        this.load.svg('process_ball','image/1.svg',{width:"15",height:"15"});
    }


    create()
    {
        this.graphics = this.add.graphics();
        //Line separate the process ball with the game
        this.Line = new Phaser.Geom.Line(0, 150, this.cameras.main.width, 150);

        this.graphics.lineStyle(2, 0xCEEEEEE);
        this.graphics.strokeLineShape(this.Line);


        //process ball frame
        this.graphics.fillStyle(0xA59E9D, 0.3);
        this.graphics.fillRoundedRect(this.posX-20, 50, 680, 40);

        this.registry.set('score', this.score);
        this.registry.set('check_flag', this.check_flag);

        this.process_ball = [];
        for (let i = 0; i < this.number_of_questions; i++)
        {
            this.process_ball[i] = this.add.sprite(this.posX + i*this.distance, this.posY, 'process_ball');
            this.process_ball[i].setScale(2);
        }

        //  Grab a reference to the Controller Scene
        var Controller = this.scene.get('Controller');

        //  Listen for events from it
        var ref = this;

        

        //event happens when the ball is in right dropzone
        Controller.events.on('minusScore', function () {
            //check_flag is true when no wrong answer before happens in a scene
            if( this.score > 0 && this.check_flag == false){
                ref.score--;

                //animation to move the process ball to the right
                Controller.animation(ref.process_ball[ref.score], ref.process_ball[ref.score].x + 400, ref.posY);

                console.log("set ball go");
            }
            else
                this.check_flag = false;

            this.registry.set('score', this.score);

        }, this);

        //event happens when the ball in is wrong dropzone
        Controller.events.on('addScore', function () {
            //check_flag ensure to update one time even when player keep choosing wrong
            if(this.score < this.number_of_questions && this.check_flag == false){

                //if the score is below zero, change to winning scene

                //animation to move the process ball to the right
                Controller.animation(ref.process_ball[ref.score], ref.process_ball[ref.score].x - 400, ref.posY);
            
                ref.score++;

                this.check_flag = true;

                console.log("return ball");
            }
            else
                console.log("nothing happens"); //for debugging

            this.check_flag = true;

            this.registry.set('score', this.score);

        }, this);
    }


    destroy(){
        console.log('destroy UI');
        for(let i = 0; i < this.number_of_questions; i++){
            this.process_ball[i].destroy(true);
            this.process_ball[i] = null;
        }
        this.graphics.destroy(true);
        this.line = null;
    }
}
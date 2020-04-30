class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });

        this.number_of_questions = 7;
        this.score = this.number_of_questions;
        this.check_flag = false;

        this.posX = 630;
        this.posY = 70;

        this.distance = 40;
        
    }


    preload(){
        this.load.svg('process_ball','../image/1.svg',{width:"15",height:"15"});
    }


    create(){
        this.create_button();
        this.create_process_ball();

        var handler = this.scene.get('Handler');
        handler.handle_back_button();
    }

    minus_score(){
        var controller = this.scene.get('controller');
        var anmt = this.scene.get('Animation');
        var uiscene = this;

        //event happens when the ball is in right dropzone
        //check_flag is true when no wrong answer before happens in a scene
        if( this.score > 0 && this.check_flag == false){
            uiscene.score--;

            //animation to move the process ball to the right
            anmt.animation_move(uiscene.process_ball[uiscene.score], uiscene.process_ball[uiscene.score].x + 400, uiscene.posY, 1000);

            console.log("set ball go");
        }
        else
            this.check_flag = false;

        this.registry.set('score', this.score);
    }

    add_score(){
        var controller = this.scene.get('controller');
        var anmt = this.scene.get('Animation');
        var uiscene = this;

        //event happens when the ball in is wrong dropzone
        //check_flag ensure to update one time even when player keep choosing wrong
        if(this.score < this.number_of_questions && this.check_flag == false){
            //animation to move the process ball to the right
            anmt.animation_move(uiscene.process_ball[uiscene.score], uiscene.process_ball[uiscene.score].x - 400, uiscene.posY, 1000);
        
            uiscene.score++;

            this.check_flag = true;

            console.log("return ball");
        }
        else
            console.log("nothing happens"); //for debugging

        this.check_flag = true;

        this.registry.set('score', this.score);
    }

    create_process_ball(){
        var uiscene = this;

        uiscene.graphics = uiscene.add.graphics();
        //Line separate the process ball with the game
        uiscene.Line = new Phaser.Geom.Line(0, 150, uiscene.cameras.main.width, 150);

        uiscene.graphics.lineStyle(10, 0xCEEEEEE);
        uiscene.graphics.strokeLineShape(uiscene.Line);


        //process ball frame
        uiscene.graphics.fillStyle(0xA59E9D, 0.3);
        uiscene.graphics.fillRoundedRect(uiscene.posX-20, 50, 680, 40);

        uiscene.registry.set('score', uiscene.score);
        uiscene.registry.set('check_flag', uiscene.check_flag);

        uiscene.process_ball = [];
        for (let i = 0; i < uiscene.number_of_questions; i++)
        {
            uiscene.process_ball[i] = uiscene.add.sprite(uiscene.posX + i*uiscene.distance, uiscene.posY, 'process_ball');
            uiscene.process_ball[i].setScale(2);
        }
    }


    create_button(){
        var uiscene = this;
        var controller = this.scene.get('Controller');
        var anmt = this.scene.get('Animation');

        //next button
        controller.graphics1 = controller.add.graphics();
        controller.graphics1.fillStyle(0x0066CC, 0.75);

        controller.nextButton = {
            rect: controller.graphics1.fillRoundedRect(controller.dragX, controller.dragY, 200, 50).setAlpha(0),
            text: controller.add.text(controller.dragX + 30, controller.dragY - 3, 'Next >', 
                    {
                        fontSize: '50px',
                        fontFamily: 'Arial',
                        color: '#FFFFFF',
                        align: 'center',
                        lineSpacing: 44,
                    }
                ).setInteractive({ useHandCursor: true }).setAlpha(0),
            disappear(){
                anmt.animation_fade_item(controller.nextButton.rect, 'fade out', 1000);
                anmt.animation_fade_item(controller.nextButton.text, 'fade out', 1000);
            },
            show(){
                anmt.animation_fade_item(controller.nextButton.rect, null, 1000);
                anmt.animation_fade_item(controller.nextButton.text, null, 1000);
            }
        };

        //back button
        controller.graphics2 = controller.add.graphics();
        controller.graphics2.fillStyle(0x0066CC, 0.75);

        controller.backButton = {
            rect: controller.graphics2.fillRoundedRect(100, 50 , 200 , 50),
            text: controller.add.text(110, 48, '< Back', 
                {
                    fontSize: '50px',
                    fontFamily: 'Arial',
                    color: '#FFFFFF',
                    align: 'center',
                    lineSpacing: 44,
                }
            ).setInteractive({ useHandCursor: true })
        };
    }


    clear(){
        var controller = this.scene.get("Controller");
        var uiscene = this;

        console.log('destroy UI');
        for(let i = 0; i < this.number_of_questions; i++){
            controller.destroy(uiscene.process_ball[i]);
        }
        controller.destroy(uiscene.graphics);
        controller.destroy(uiscene.line);

        controller.destroy(controller.nextButton.text);
        controller.destroy(controller.graphics1);

        controller.destroy(controller.backButton.text);
        controller.destroy(controller.graphics2);
    }
}
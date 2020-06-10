class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });

        this.number_of_questions = 10;
        this.left_side = [];
        for (let i = 0; i < this.number_of_questions; i++){
            this.left_side[i] = 1;
        }
        this.right_side = [];

        //constant to set up UI element including button and process ball
        const _POSX_ = 630;
        const _POSY_ = 70;
        const _BALL_WIDTH_ = 40;
        
    }
    preload(){
        this.load.svg('process_ball','../assets/1.svg',{width:"30",height:"30"});
    }
    create(){
        init_scope();
        this.create_button();
        this.create_process_ball();
    }
    manage_ball(flag){
        if(this.first_time === false) return;
        if(flag === 'move left'){
            this.move_ball_left();
        }
        if(flag === 'move right'){
            this.move_ball_right();
        }
    }
    move_ball_right(){
        if(this.left_side.length != 0){
            let id = this.left_side.length - 1;
            this.right_side.push(this.left_side.pop());
            anmt.animation_move(this.process_ball[id], this.process_ball[id].x + this.number_of_questions * /* _BALL_WIDTH_ */40, /* _POSY_: */70, /* preset duration */1000);
        }
    }
    move_ball_left(){
        if(this.right_side.length != 0){
            this.left_side.push(this.right_side.shift());
            let id = this.left_side.length - 1;
            anmt.animation_move(this.process_ball[id], this.process_ball[id].x - this.number_of_questions * /* _BALL_WIDTH_ */40, /* _POSY_: */70, /* preset duration */1000);
        }
    }
    is_end_game(){
        if(this.left_side.length === 0) return true;
        return false;
    }
    create_process_ball(){
        this.graphics = this.add.graphics();
        //Line separate the process ball with the game
        this.Line = new Phaser.Geom.Line(/* preset - x1 coordinate */0, /* preset - y1 coordinate */150, /* preset - x2 coordinate */this.cameras.main.width, /* preset - y2 coordinate */150);
        this.graphics.lineStyle/* presetColor */(10, 0xCEEEEEE);
        this.graphics.strokeLineShape(this.Line);

        //process ball frame
        this.graphics.fillStyle/* presetColor */(0xA59E9D, 0.3);
        this.graphics.fillRoundedRect(/* _POSX_: */630 - /*offset value for displaying frame*/20, /* _POSY_: */70 - /*offset value for displaying frame*/20, 
            /* the length which is propotional to number of question */(this.number_of_questions * /* _BALL_WIDTH_ */40 * 2), /* preset- height of frame */40);
        //create balls 
        this.process_ball = [];
        for (let i = 0; i < this.number_of_questions; i++)
        {
            this.process_ball[i] = this.add.sprite(/* _POSX_: */630 + i*/* _BALL_WIDTH_ */40, /* _POSY_: */70, 'process_ball');
        }
        this.first_time = true;
    }
    create_button(){
        //next button
        controller.graphics1 = controller.add.graphics();
        controller.graphics1.fillStyle(0x0066CC, 0.75);
        controller.nextButton = {
            rect: controller.graphics1.fillRoundedRect(/* preset posX */1600, /* preset posY */50, /* preset width */200, /* preset height */50)./* preset alpha */setAlpha(0),
            text: scnmng.generate_text(/* preset posX */1600 + /*offset value for displaying text*/30, /* preset posY */50 - /*offset value for displaying text*/3, 
                'Next >', '50px', /* black */'#FFFFFF')./* preset alpha */setAlpha(0),
            disappear: () => {
                anmt.animation_fade_item(controller.nextButton.rect, /* specify type */'fade out', /* preset duration */1000);
                anmt.animation_fade_item(controller.nextButton.text, /* specify type */'fade out', /* preset duration */1000);
            },
            show: () => {
                anmt.animation_fade_item(controller.nextButton.rect, /* specify type */null, /* preset duration */1000);
                anmt.animation_fade_item(controller.nextButton.text, /* specify type */null, /* preset duration */1000);
            }
        };

        //back button
        controller.graphics2 = controller.add.graphics();
        controller.graphics2.fillStyle/* presetColor */(0x0066CC, 0.75);
        controller.backButton = {
            rect: controller.graphics2.fillRoundedRect(/* preset posX */100, /* preset posY */50 , /* preset width */200 , /* preset height */50),
            text: scnmng.generate_text(/* preset posX */100 + /*offset value for displaying text*/10, /* preset posY */50 - /*offset value for displaying text*/2, 
                '< Back', '50px', /* black */'#FFFFFF')
        };
    }
    manage_next_button(){
        this.manage_ball('move right');
        this.first_time = true;
        anmt.animation_fade_screen('fade out', 1000);
        controller.nextButton.disappear();
        setTimeout( () => {
            //clear current game
            scnmng.clear_current_game();
            //if finish score then next scene will be end-scene
            if(this.is_end_game()){
                //destroy UI scene
                this.clear_UI();
                //get to screen end
                window.location='win_screen.html';
            }
            else {
                //change to next scene                     
                controller.scene_opening();
            }
        },/* preset wait time */3000)
    }
    manage_back_button(){
        scnmng.clear_current_game();
        this.clear_UI();
        window.location = 'index.html';
    }
    clear_UI(){
        for(let i = 0; i < this.number_of_questions; i++){
            scnmng.destroy(this.process_ball[i]);
        }
        scnmng.destroy(this.graphics);
        scnmng.destroy(controller.nextButton.text);
        scnmng.destroy(controller.graphics1);
        scnmng.destroy(controller.backButton.text);
        scnmng.destroy(controller.graphics2);
    }
}
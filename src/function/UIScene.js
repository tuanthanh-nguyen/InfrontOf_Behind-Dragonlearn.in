class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });

        this.number_of_questions = 10;
        this.score = this.number_of_questions;
        this.check_flag = false;

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
    //Getter and setter function//
    /*
        Since the phaser has kinda a mixture of JS ES6 and the game canvas only operate in one scope which acts as a class.
        In here, i choose the controller class as the inter-mediate class to run the game.
        As a result, other classes have to borrow the scope of each others in order to be fully functional.
    */
    get_controller(){
        if(this.controller === undefined) this.controller = this.scene.get('Controller');
        return this.controller;
    }
    get_anmt(){
        if(this.anmt === undefined) this.anmt = this.scene.get('Animation');
        return this.anmt;
    }
    get_scnmng(){
        if(this.scnmng === undefined) this.scnmng = this.scene.get('SceneManager');
        return this.scnmng;
    }
    get_handler(){
        if(this.handler === undefined) this.handler = this.scene.get('Handler');
        return this.handler;
    }
    preload(){
        this.load.svg('process_ball','../assets/1.svg',{width:"15",height:"15"});
    }
    create(){
        this.create_button();
        this.create_process_ball();

        // this.get_handler().handle_back_button();
    }
    // move_ball_right(){
    //     //event happens when the ball is in right dropzone
    //     //check_flag is true when no wrong answer before happens in a scene
    //     if( this.score > 0 && this.check_flag == false){
    //         this.score--;
    //         //animation to move the process ball to the right
    //         this.get_anmt().animation_move(this.process_ball[this.score], 
    //             this.process_ball[this.score].x + this.number_of_questions * /* _BALL_WIDTH_ */40, /* _POSY_: */70, /* preset duration */1000);
    //     }
    //     else
    //         this.check_flag = false;
    //     // this.registry.set('score', this.score);
    // }
    // move_ball_left(){
    //     //event happens when the ball in is wrong dropzone
    //     //check_flag ensure to update one time even when player keep choosing wrong
    //     if(this.score < this.number_of_questions && this.check_flag == false){
    //         //animation to move the process ball to the right
    //         this.get_anmt().animation_move(this.process_ball[this.score], 
    //             this.process_ball[this.score].x - this.number_of_questions * /* _BALL_WIDTH_ */40, /* _POSY_: */70, /* preset duration */1000);
    //         this.score++;
    //         this.check_flag = true;
    //     }
    //     else
    //         console.log("nothing happens"); //for debugging
    //     this.check_flag = true;
    // }
    manage_ball(flag){
        if(this.first_time === true && flag === 'move left'){
            this.move_ball_left();
        }
        if(this.first_time === true && flag === 'move right'){
            this.move_ball_right();
        }
    }
    move_ball_right(){
        if(this.left_side.length != 0){
            let id = this.left_side.length - 1;
            this.right_side.push(this.left_side.pop());
            this.get_anmt().animation_move(this.process_ball[id], this.process_ball[id].x + this.number_of_questions * /* _BALL_WIDTH_ */40, /* _POSY_: */70, /* preset duration */1000);
        }
    }
    move_ball_left(){
        if(this.right_side.length != 0){
            this.left_side.push(this.right_side.shift());
            let id = this.left_side.length - 1;
            this.get_anmt().animation_move(this.process_ball[id], this.process_ball[id].x - this.number_of_questions * /* _BALL_WIDTH_ */40, /* _POSY_: */70, /* preset duration */1000);
        }
    }
    is_end_game(){
        if(this.left_side.length === 0) return true;
        return false;
    }
    move_ball(item, flag){
        if(flag === 'add')
        this.get_anmt().animation_move(item, item.x - this.number_of_questions * 40, 70, 1000);
        if(flag === 'minus')   
        this.get_anmt().animation_move(this.process_ball[this.curr_ind], 
            this.process_ball[this.curr_ind].x + this.number_of_questions * 40, 70, 1000);
    }
    create_process_ball(){
        this.graphics = this.add.graphics();
        //Line separate the process ball with the game
        this.Line = new Phaser.Geom.Line(/* preset - x coordinate */0, /* preset - y coordinate */150, this.cameras.main.width, /* preset width */150);
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
            this.process_ball[i] = this.get_scnmng().item_factory(/* _POSX_: */630 + i*/* _BALL_WIDTH_ */40, /* _POSY_: */70, 'process_ball').setOrigin(0.5);
            this.process_ball[i].setScale(2);
            this.process_ball[i].setCollideWorldBounds(true);
        }
        this.first_time = true;
    }
    create_button(){
        //next button
        this.get_controller().graphics1 = this.get_controller().add.graphics();
        this.get_controller().graphics1.fillStyle(0x0066CC, 0.75);
        this.get_controller().nextButton = {
            rect: this.get_controller().graphics1.fillRoundedRect(/* preset posX */1600, /* preset posY */50, /* preset width */200, /* preset height */50)./* preset alpha */setAlpha(0),
            text: this.get_controller().add.text(/* preset posX */1600 + /*offset value for displaying text*/30, /* preset posY */50 - /*offset value for displaying text*/3, 'Next >', 
                {
                    fontSize: '50px',
                    fontFamily: 'Arial',
                    color: '#FFFFFF',
                    align: 'center',
                    lineSpacing: 44,
                }
            ).setInteractive({ useHandCursor: true })./* preset alpha */setAlpha(0),
            disappear: () => {
                this.get_anmt().animation_fade_item(this.get_controller().nextButton.rect, /* specify type */'fade out', /* preset duration */1000);
                this.get_anmt().animation_fade_item(this.get_controller().nextButton.text, /* specify type */'fade out', /* preset duration */1000);
            },
            show: () => {
                this.get_anmt().animation_fade_item(this.get_controller().nextButton.rect, /* specify type */null, /* preset duration */1000);
                this.get_anmt().animation_fade_item(this.get_controller().nextButton.text, /* specify type */null, /* preset duration */1000);
            }
        };

        //back button
        this.get_controller().graphics2 = this.get_controller().add.graphics();
        this.get_controller().graphics2.fillStyle/* presetColor */(0x0066CC, 0.75);
        this.get_controller().backButton = {
            rect: this.get_controller().graphics2.fillRoundedRect(/* preset posX */100, /* preset posY */50 , /* preset width */200 , /* preset height */50),
            text: this.get_controller().add.text(/* preset posX */100 + /*offset value for displaying text*/10, /* preset posY */50 - /*offset value for displaying text*/2, '< Back', 
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
        for(let i = 0; i < this.number_of_questions; i++){
            this.get_controller().destroy(this.process_ball[i]);
        }
        this.get_controller().destroy(this.graphics);
        this.get_controller().destroy(this.line);
        this.get_controller().destroy(this.get_controller().nextButton.text);
        this.get_controller().destroy(this.get_controller().graphics1);
        this.get_controller().destroy(this.get_controller().backButton.text);
        this.get_controller().destroy(this.get_controller().graphics2);
    }
}
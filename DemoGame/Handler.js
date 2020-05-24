class Handler extends Phaser.Scene{
    constructor(){
        super("Handler");
        const _DROPX_ = 250;
        const _DROPY_ = 500;
        const _DRAGX_ = 1200;
        const _DRAGY_ = 700;
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

    get_uiscene(){
        if(this.uiscene === undefined) this.uiscene = this.scene.get('UIScene');
        return this.uiscene;
    }

    get_anmt(){
        if(this.anmt === undefined) this.anmt = this.scene.get('Animation');
        return this.anmt;
    }
    get_scnmng(){
        if(this.scnmng === undefined) this.scnmng = this.scene.get('SceneManager');
        return this.scnmng;
    }
    /**
     * for handling all mouse events
     * @param {arcadeSprite} dragItem - sprite object
     * @param {arcadeSprite} dropItem - sprite object
     * @param {arcadeSprite} dropFake - sprite object
     */
    drag_and_drop  (dragItem, dropItem, dropFake)  {
        this.dragging();
        this.drag_enter();
        this.drag_leave();
        this.drag_end(dragItem);
        this.drop(dragItem, dropItem, dropFake);
        this.handle_back_button();
        this.handle_next_button();
        this.dev_perk();
    }
    dragging(){
        this.get_controller().input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }
    drag_enter(){
        this.get_controller().input.on('dragenter', (pointer, gameObject, dropZone) => {
            dropZone.setTint(0xffff000);
            //if behind then item appears to be behind
            if(dropZone === this.get_controller().drop_item[1].sprite 
            /* && gameObject.y > this.get_controller.dropY + 150 */) {gameObject.setDepth(-0.5)}
            else { gameObject.setDepth(0.5)}
    
        });
    }
    drag_leave(){
        this.get_controller().input.on('dragleave', (pointer, gameObject, dropZone) => {
            dropZone.clearTint();
        });
    }
    /**
     * if player release the mouse not in the specified zone
     * @param {arcadeSprite} dragItem - sprite object
     */
    drag_end(dragItem){
        this.get_controller().input.on('dragend',  (pointer, gameObject, dropped) => {
            if (!dropped) 
                this.get_anmt().animation_move(dragItem, this.get_scnmng().get_drag_item().dragX, this.get_scnmng().get_drag_item().dragY, /* duration */1000);
        });
    }
    /**
     * if playser release the mouse in the specified zone
     * @param {arcadeSprite} dragItem - sprite object
     * @param {arcadeSprite} dropItem - sprite object
     * @param {arcadeSprite} dropFake - sprite object
     */
    drop(dragItem, dropItem, dropFake){
        this.get_controller().input.on('drop',  (pointer, gameObject, dropZone) => {
            //happens when drop to wrong dropzone
            if(dropZone === dropFake){
                // this.get_uiscene().move_ball_left();
                this.get_uiscene().manage_ball('move left');
                this.get_uiscene().first_time = false;
                this.get_anmt().animation_move(dragItem, this.get_scnmng().get_drag_item().dragX, this.get_scnmng().get_drag_item().dragY, /* duration */1000);
                this.get_anmt().animation_alert(dropZone, /* color: red */[255, 0, 0], /* duration */2000);
                setTimeout( () => this.get_anmt().animation_hint(dropItem, /* color: powderblue */[176, 224, 230], /* duration */2000), /* wait time */2000);
            }
            //happens when drop to right dropzone
            if(dropZone === dropItem ){
                gameObject.input.enabled = false;   
                this.get_anmt().animation_true_pos(gameObject);
                dropZone.setTint(0x00ff00); 
                setTimeout( () => this.get_controller().nextButton.show(), /* preset wait time */3000);
            }   
        });
    }
    handle_back_button(){
        this.get_controller().backButton.text.once('pointerup',() => {
            this.get_scnmng().clear_current_game();
            this.get_uiscene().clear();
            window.location = '../index.html';
        })
    }
    handle_next_button(){
        this.get_controller().nextButton.text.once('pointerup',() => {
            this.get_uiscene().manage_ball('move right');
            this.get_uiscene().first_time = true;
            this.get_anmt().animation_fade_screen('fade out', 1000);
            this.get_controller().nextButton.disappear();
            setTimeout( () => {
                //clear current game
                this.get_scnmng().clear_current_game();
                //if finish score then next scene will be end-scene
                if(this.get_uiscene().is_end_game()){
                    //destroy UI scene
                    this.get_uiscene().clear();
                    //get to screen end
                    window.location='../win_screen.html';
                }
                else {
                    //change to next scene                     
                    this.get_controller().scene_opening();
                }
            },/* preset wait time */3000)
        })
    }
    dev_perk(){
        //move ball right
        this.get_controller().input.keyboard.once('keydown_R', () => {
            this.get_uiscene().move_ball_right();
        });
        //move ball left
        this.get_controller().input.keyboard.once('keydown_L', () => {
            this.get_uiscene().move_ball_left();
        });
        //return to index
        this.get_controller().input.keyboard.once('keydown_B', () => {
            this.get_scnmng().clear_current_game();
            this.get_uiscene().clear();
            window.location = '../index.html';
        });
        //move to true pos
        this.get_controller().input.keyboard.once('keydown_C', () => {
            this.get_anmt().animation_true_pos(this.get_scnmng().get_drag_item().sprite);
        });
        //move to original pos
        this.get_controller().input.keyboard.once('keydown_D', () => {
            this.get_anmt().animation_move(this.get_scnmng().get_drag_item().sprite, /* _DRAGX_ */1200, /* _DRAGY_ */700, /* duration */1000);
        });
        //create new scene
        this.get_controller().input.keyboard.once('keydown_N', () => {
            this.get_anmt().animation_fade_screen('fade out', 0);
            this.get_controller().scene_opening();
        });
        //play audio
        this.get_controller().input.keyboard.once('keydown_P', () => {
            this.scene.get("Speaker").voice(this.get_scnmng().get_statement());
        });
    }
}
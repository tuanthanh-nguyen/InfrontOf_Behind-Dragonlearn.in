class Handler extends Phaser.Scene{
    constructor(){
        super("Handler");
    }

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
    drag_and_drop  (dragItem, dropItem, dropFake)  {
        //invoke when dragging
        this.get_controller().input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.get_controller().input.on('dragenter', (pointer, gameObject, dropZone) => {
            dropZone.setTint(0xffff000);
            //if behind then item appears to be behind
            if(dropZone == this.get_controller().drop[1].sprite 
            /* && gameObject.y > this.get_controller.dropY + 150 */) {gameObject.setDepth(-0.5)}
            else { gameObject.setDepth(0.5)}
    
        });
    
        this.get_controller().input.on('dragleave', (pointer, gameObject, dropZone) => {
            dropZone.clearTint();
        });

        this.get_controller().input.on('dragend',  (pointer, gameObject, dropped) => {
            if (!dropped) 
                this.get_anmt().animation_move(dragItem, this.get_controller().dragX, this.get_controller().dragY, 1000);
        });

        this.get_controller().input.on('drop',  (pointer, gameObject, dropZone) => {
            //happens when drop to wrong dropzone
            if(dropZone == dropFake){
                this.get_uiscene().add_score();
                // this.events.emit('addScore');
                dropZone.setTint(0xFF0000);
                this.get_anmt().animation_move(dragItem, this.get_controller().dragX, this.get_controller().dragY ,1000);
                setTimeout( () => this.get_anmt().animation_alert(), 1000);
                setTimeout( () => this.get_anmt().animation_tutorial(), 2000);
            }
            //happens when drop to right dropzone
            if(dropZone == dropItem ){
                gameObject.input.enabled = false;   
                this.get_anmt().animation_true_pos(gameObject);
                dropZone.setTint(0x00ff00); 
                setTimeout( () => this.get_controller().nextButton.show(), 3000);
            }   
            setTimeout( () => dropZone.clearTint(),3000);
        });
        this.handle_back_button();
        this.handle_next_button();
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
            this.get_uiscene().minus_score();
            this.get_anmt().animation_fade_screen('fade out', 1000);
            this.get_controller().nextButton.disappear();
            setTimeout( () => {
                //clear current game
                this.get_scnmng().clear_current_game();
                //if finish score then next scene will be end-scene
                if(this.get_uiscene().score <= 0){
                    //destroy UI scene
                    this.get_uiscene().clear();
                    window.location='../win_screen.html';
                }
                //change to next scene 
                else {
                    this.get_controller().scene_opening();
                }
            },3000)
        })
    }
}
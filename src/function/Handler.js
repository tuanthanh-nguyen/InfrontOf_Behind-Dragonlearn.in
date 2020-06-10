class Handler extends Phaser.Scene{
    constructor(){
        super("Handler");
    }
    /**
     * for handling all mouse events
     * @param {Object} dragItem - pattern object with sprite
     * @param {Object} dropItem - pattern object with sprite
     * @param {Object} dropFake - pattern object with sprite
     */
    drag_and_drop  (dragItem, dropItem, dropFake)  {
        this.dragging();
        this.drag_enter();
        this.drag_leave();
        this.drag_end(dragItem);
        this.drop(dragItem, dropItem, dropFake);
        this.handle_back_button();
        this.handle_next_button();
    }
    dragging(){
        controller.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }
    drag_enter(){
        controller.input.on('dragenter', (pointer, gameObject, dropZone) => {
            dropZone.setTint(0xffff000);
            //if behind then item appears to be behind
            if(dropZone === controller.drop_item[1].sprite 
            /* && gameObject.y > this.get_controller.dropY + 150 */) {gameObject.setDepth(-0.5)}
            else { gameObject.setDepth(0.5)}
    
        });
    }
    drag_leave(){
        controller.input.on('dragleave', (pointer, gameObject, dropZone) => {
            dropZone.clearTint();
        });
    }
    /**
     * if player release the mouse not in the specified zone
     * @param {Object} dragItem - pattern object with sprite
     */
    drag_end(dragItem){
        controller.input.on('dragend',  (pointer, gameObject, dropped) => {
            if (!dropped) 
                anmt.animation_move(dragItem.sprite, dragItem.dragX, dragItem.dragY, /* duration */1000);
        });
    }
    /**
     * for handling all mouse events
     * @param {Object} dragItem - pattern object with sprite
     * @param {Object} dropItem - pattern object with sprite
     * @param {Object} dropFake - pattern object with sprite
     */
    drop(dragItem, dropItem, dropFake){
        controller.input.on('drop',  (pointer, gameObject, dropZone) => {
            if(dropZone === dropItem.sprite) this.drop_correct(dragItem, dropItem);
            if(dropZone === dropFake.sprite) this.drop_wrong(dragItem, dropFake);
        });
    }
    /**
     * for right wrong zone
     * @param {arcadeSprite} dragItem - sprite phaser
     * @param {arcadeSprite} dropItem - sprite phaser
     */
    drop_correct(drag, drop){
        drag.sprite.input.enabled = false;   
        anmt.animation_true_pos(drag.sprite);
        drop.sprite.setTint(0x00ff00); 
        setTimeout( () => controller.nextButton.show(), /* preset wait time */3000);
    }
    /**
     * for drop wrong zone
     * @param {Object} drag - pattern object with sprite
     * @param {Object} drop - pattern object with sprite
     */
    drop_wrong(drag, drop){
        uiscene.manage_ball('move left');
        uiscene.first_time = false;
        anmt.animation_move(drag.sprite, drag.dragX, drag.dragY, /* duration */1000);
        anmt.animation_alert(drop.sprite, /* color: red */[255, 0, 0], /* duration */2000);
        setTimeout( () => anmt.animation_hint(drop.sprite, /* color: powderblue */[176, 224, 230], /* duration */2000), /* wait time */2000);
    }
    handle_back_button(){
        controller.backButton.text.once('pointerup',() => uiscene.manage_back_button() )
    }
    handle_next_button(){
        controller.nextButton.text.once('pointerup',() => uiscene.manage_next_button() )
    }
}
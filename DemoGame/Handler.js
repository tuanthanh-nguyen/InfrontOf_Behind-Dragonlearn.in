class Handler extends Phaser.Scene{
    constructor(){
        super("Handler");
    }

    drag_and_drop  (dragItem, dropItem, dropFake, dragX, dragY, behindDrop)  {
        var handler = this;
        var controller = this.scene.get('Controller');
        var anmt = this.scene.get('Animation');
        var uiscene = this.scene.get('UIScene');
        var scenemng = this.scene.get('SceneManager');
        
        //invoke when dragging
        controller.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        controller.input.on('dragenter', function (pointer, gameObject, dropZone) {

            dropZone.setTint(0xffff000);

            //if behind then item appears to be behind
            if(dropZone == controller.drop[1]) {gameObject.setDepth(-0.5)}
            else { gameObject.setDepth(0.5)}
    
        });
    
        controller.input.on('dragleave', function (pointer, gameObject, dropZone) {
    
            dropZone.clearTint();
    
        });

        controller.input.on('dragend', function (pointer, gameObject, dropped) {

            if (!dropped) anmt.animation_move(dragItem, controller.dragX, controller.dragY, 1000);

        }.bind(controller));

        controller.input.on('drop', function (pointer, gameObject, dropZone) {

            //happens when drop to wrong dropzone
            if(dropZone == dropFake){
                uiscene.add_score();
                // this.events.emit('addScore');

                dropZone.setTint(0xFF0000);

                anmt.animation_move(dragItem, controller.dragX, controller.dragY ,1000);

                setTimeout(function(){anmt.animation_alert()},1000);
                setTimeout(function(){anmt.animation_tutorial()},2000);
            }
            //happens when drop to right dropzone
            if(dropZone == dropItem ){
                gameObject.input.enabled = false;
                
                anmt.animation_true_pos(gameObject);

                dropZone.setTint(0x00ff00);
                
                setTimeout(function(){controller.getNextButton().show()},3000);
            }   
            setTimeout(function(){dropZone.clearTint();},3000);
        }.bind(controller));

        handler.handle_back_button();
        handler.handle_next_button();
    }


    handle_back_button(){
        var controller = this.scene.get('Controller');

        controller.getBackButton().text.once('pointerup',function(){
            window.location = '../index.html';
        })
    }

    handle_next_button(){
        var controller = this.scene.get('Controller');
        var anmt = this.scene.get('Animation');
        var uiscene = controller.scene.get('UIScene');
        var scenemng = controller.scene.get('SceneManager');

        controller.getNextButton().text.once('pointerup',function(){
            uiscene.minus_score();
            anmt.animation_fade_screen('fade out', 1000);
            controller.getNextButton().disappear();
            setTimeout(function(){

                //clear current game
                scenemng.clear_current_game();
                
                //if finish score then next scene will be end-scene
                if(uiscene.score <= 0){
                    //destroy UI scene
                    uiscene.clear();
                    
                    window.location='../index.html';
                }
                //change to next scene 
                else {
                    controller.scene_opening();
                }
            },3000)
        })
    }
}
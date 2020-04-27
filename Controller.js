class Controller extends Phaser.Scene{
    constructor(){
        super("Controller");
    }
    preload(){
        this.load.image('next_button','image/back_icon.png');
        this.load.image('drag', 'image/35.png');
        this.load.image('drop', 'image/53.png');
        this.load.image('drop1', 'image/47.png');
        this.load.image('end', 'image/icon_logo.jpg');
        // this.load.image('sound', 'image/loa.png');
        this.load.image('bag', 'image/41.png');
        
        // this.load.audio('sfx','voice.mp3');
    }


    create(){
        this.cameras.main.backgroundColor.setTo(255,255,255);

        //create next_button arrow but set it invisible and turn around
        this.next_button = this.add.sprite(1200, 900, 'next_button').setInteractive();
        this.next_button.setVisible(false);
        this.next_button.angle = 180;
        //scale items in canvas
        this.next_button.setScale(0.3);

        //create back_button arrow but set it invisible and turn around
        this.back_button = this.add.sprite(150, 100, 'next_button').setInteractive();
        this.back_button.setVisible(true);
        //scale items in canvas
        this.back_button.setScale(0.3);


        //launch the first scene
        this.scene.launch('SceneA');
        //set current scene
        this.currentScene = this.scene.get('SceneA');

        
    }

    
    setDraggable  (dragItem)  {
        //set physics of the ball
        dragItem.setCollideWorldBounds(true);

        //allow items to be dragged
        this.input.setDraggable(dragItem);
    }


    setDroppable  (dropItem)  {
        
        if(dropItem != null) 
            dropItem.input.dropZone = true;

    }


    drag_and_drop  (dragItem, dropItem, dropFake)  {
        console.log(this.currentScene); //for debugging

        //invoke when dragging
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        //invoke when drop, if in the drop zone then execute
        this.input.on('drop', function (pointer, gameObject, dropZone) {

            if(dropZone == dropFake){
                console.log("wrong");
                var ref = this;
                this.events.emit('addScore');
                this.animation(dragItem,ref.currentScene.drag_X,ref.currentScene.drag_Y);
            }
            if(dropZone == dropItem ){
                console.log(dropZone == dropItem);
                gameObject.input.enabled = false;
                this.animation(dragItem,dropZone.x + dropZone.input.hitArea.width/2,dropZone.y + dropZone.input.hitArea.height/2);
                //visiblize next button
                this.visible_item(this.next_button,true);
            }
        }.bind(this));
    
        //invoke the moment drop event occur, if not in the drop zone then execute
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            // console.log(this);
            var ref = this;
            if (!dropped) this.animation(dragItem,ref.currentScene.drag_X,ref.currentScene.drag_Y);
        }.bind(this));

        //invoke when next button is visible
        this.handler_button(dragItem, dropItem, dropFake);
    }


    handler_button(dragItem, dropItem, dropFake){
        //invoke when finish the valid pos
        this.next_button.once('pointerup', function (pointer) {
            //check for process game in UIScene
            this.events.emit('minusScore');

            //reset the item drag and drop
            var ref = this;

            //change to next scene
            setTimeout(function(){
                var tmp = ref.registry.get('score');
                console.log(tmp);
                
                //if finish score then next scene will be end-scene
                if(tmp <= 0){
                    //clear the current scene item
                    ref.currentScene.clear_item();

                    //destroy UI process-ball
                    ref.currentScene = ref.scene.get("UIScene");
                    ref.currentScene.destroy();

                    //destroy next button
                    ref.destroy(ref.next_button);

                    //change to ending scene
                    ref.scene.launch('End');
                    ref.currentScene = ref.scene.get('End');
                    console.log(ref.currentScene);
                }
                //change to next scene of a scene (sceneA -> sceneB, sceneB -> sceneC)
                else ref.currentScene = ref.currentScene.invoke_next_scene(ref.currentScene); 
            },3000);

            //hide the next button
            this.visible_item(this.next_button,false);
            
        }.bind(this)); 

        //invoke when player click back button
        this.back_button.once('pointerup', function (pointer) {
            window.location='index.html';
        });
    }


    play_audio(item,audio){
        item.on('pointerdown', function (pointer) {
            audio.play();   
        });
    }


    animation(item,pos_x,pos_y){
        var timeline = this.tweens.createTimeline();
                timeline.add({
                    targets: item,
                    x: pos_x,
                    y: pos_y,
                    ease: 'Power1',
                    duration: 1000
                });
                timeline.play();
    }


    visible_item(item,flag){
        //set visible next_button button
        setTimeout(function(){item.setVisible(flag);},2000);
    }  


    item_factory(posX, posY, item){
        return this.physics.add.sprite(posX ,posY, item).setInteractive();
    }


    destroy(item){
        if(item!=null) {
            item.destroy(true);
            item = null;
        }
    }


    clear_scene(dragItem,dropItem,dropFake){

        this.destroy(dragItem);

        this.destroy(dropItem);

        this.destroy(dropFake);
    }
}

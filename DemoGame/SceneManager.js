class SceneManager extends Phaser.Scene{
    constructor(){
        super("SceneManager");
    }

    set_draggable  (dragItem)  {
        var controller = this.scene.get("Controller")
        //set physics of the ball
        dragItem.setCollideWorldBounds(true);

        //allow items to be dragged
        controller.input.setDraggable(dragItem);
    }


    set_droppable  (dropItem)  {
        //set drop item
        if(dropItem != null) 
            dropItem.input.dropZone = true;
    }


    create_game(){
        var scenemng = this;
        var controller = this.scene.get('Controller');
        var handler = this.scene.get('Handler');
        var speaker = this.scene.get('Speaker');
        var anmt = this.scene.get('Animation');

        //setting up dropping zone
        controller.drop = [];
        //infront is case 0
        controller.drop[0] = scenemng.item_factory(controller.dropX, controller.dropY, "drop").setDepth(-1);  
        //behind is case 1 
        controller.drop[1] = scenemng.item_factory(controller.dropX, controller.dropY, "drop1").setDepth(-1);  

        
        var obstacle = [];
        obstacle[0] = {
            item: 'bag',
            offsetX: 0,
            offsetY: -180
        };
        obstacle[1] = {
            item: 'cactus',
            offsetX: 50,
            offsetY: -100
        };
        var randIndex2 = controller.get_random_int(0,1);
        //setting up initial possition
        controller.obstacle_item = scenemng.item_factory(controller.dropX + obstacle[randIndex2].offsetX, 
            controller.dropY + obstacle[randIndex2].offsetY, obstacle[randIndex2].item);


        controller.drag = [];
        controller.drag[0] = {
            item: 'ball',
            offSet: [
                {
                    X: 0,
                    Y: -100
                },
                {   
                    X:-200,
                    Y: -200
                }
            ]
        };
        controller.drag[1] = {
            item: 'book',
            offSet:[
                {
                    X: -50,
                    Y: -120
                },
                {
                    X: -200,
                    Y: -240
                }
            ]
        };

        controller.dragType = controller.get_random_int(0,1);  //track drag object type
        //setting up initial possition
        controller.drag_item = scenemng.item_factory(controller.dragX, controller.dragY, controller.drag[controller.dragType].item);

        scenemng.set_draggable( controller.drag_item);
        scenemng.set_droppable( controller.drop[0]);
        scenemng.set_droppable( controller.drop[1]);

        //in front or behind case
        controller.caseType = controller.get_random_int(0,1);
        if(controller.caseType == 0)
            handler.drag_and_drop(controller.drag_item, controller.drop[0], controller.drop[1], controller.dragX, controller.dragY, controller.drop[1]);
        else 
            handler.drag_and_drop(controller.drag_item, controller.drop[1], controller.drop[0], controller.dragX, controller.dragY, controller.drop[1]);


        var tmp;
        if(controller.caseType == 0) tmp = 'in front of';
        else tmp = 'behind of'

        var sentence = 'Put the ' + controller.drag[controller.dragType].item + ' ' + tmp + ' the ' + obstacle[randIndex2].item;
        //setting up text
        controller.sentence = controller.add.text(700, 200, sentence, 
            {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#AAAAAAA',
                align: 'center',
                lineSpacing: 44,
            }
        ).setInteractive({ useHandCursor: true });
        controller.sound = scenemng.item_factory( 550, 170, 'sound');
        //setting up sound
        speaker.say(controller.sound,sentence);
        speaker.say(controller.sentence,sentence);

        anmt.animation_fade_screen('fade in', 1000);
    }
    clear_current_game(){
        var controller = this.scene.get("Controller");

        controller.destroy(controller.drop[0]);
        controller.destroy(controller.drop[1]);
        controller.destroy(controller.drag_item);
        controller.destroy(controller.obstacle_item);
        controller.destroy(controller.sound);
        controller.destroy(controller.sentence);  
    }


    item_factory(posX, posY, item){
        var controller = this.scene.get("Controller");

        return controller.physics.add.sprite(posX ,posY, item).setInteractive({ pixelPerfect: true}).setOrigin(0,0);
    }
}
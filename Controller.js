class Controller extends Phaser.Scene{
    constructor(){
        super("Controller");
        this.drag_X = 1200;
        this.drag_Y = 700;
        this.drop_X = 300;
        this.drop_Y = 500;
        this.currentScene;
        this.drag;
    }
    preload(){
        this.load.image('next_button','image/back_icon.png');
        this.load.image('drag', 'image/35.png');
        this.load.image('drop', 'image/53.png');
        this.load.image('sound', 'image/loa.png');
        this.load.image('bag', 'image/41.png');
        
        this.load.audio('sfx','voice.mp3');
    }
    create(){
        // //create next_button arrow but set it invisible and turn around
        //     this.next_button = this.add.sprite(900, 700, 'next_button').setInteractive();
        //     this.next_button.setVisible(false);
        //     this.next_button.angle = 180;

        // //create and display items to canvas
        //     this.drop = this.physics.add.sprite(this.drop_X ,this.drop_Y,'drop').setOrigin(0,0);
        //     this.drag = this.physics.add.sprite(this.drag_X ,this.drag_Y,'drag').setInteractive();
        
        // //scale items in canvas
        //     this.next_button.setScale(0.5);
        //     this.drop.setScale(1.5);
        //     this.drag.setScale(1.5);

        // //set drag item and drop zone item
        //     this.setDraggable(this.drag);
        //     this.setDroppable(this.drop);
    
        // //set event listener to mouse 
        //     this.drag_and_drop(this.drag,this.drop,this.next_button);       

        this.scene.launch('SceneA');
        this.scene.launch('SceneB');

        this.currentScene = this.scene.get('SceneA');
    }
    setDraggable  (dragItem)  {
        //set physics of the ball
        dragItem.setCollideWorldBounds(true);

        //allow items to be dragged
        this.input.setDraggable(dragItem);
    }
    setDroppable  (dropItem)  {
        var zone = this.add.zone(dropItem.x + dropItem.displayWidth/4, dropItem.y + dropItem.displayHeight/4).setRectangleDropZone(dropItem.displayWidth/2, dropItem.displayHeight/2);
        var graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);
    }
    drag_and_drop  (dragItem,dropItem,next_button)  {


        //invoke when dragging
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        //invoke the moment drop event occur, if not in the drop zone then execute
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            // console.log(dropZone);
            gameObject.input.enabled = false;
            this.animation(dragItem,dropZone.x + dropZone.input.hitArea.width/2,dropZone.y + dropZone.input.hitArea.height/2);
            //visiblize next button
            this.show_next_button(next_button);
        }.bind(this));
    
        //invoke when drop, if in the drop zone then execute
        this.input.on('dragend', function (pointer, gameObject,dropped) {
            // console.log(this);
            if (!dropped) this.animation(dragItem,1200,700);
        }.bind(this));
  
        //invoke when finish the valid pos
        next_button.on('pointerup', function (pointer) {
            this.events.emit('addScore');
        }.bind(this));   
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
    show_next_button(item){
        //set visible next_button button
        setTimeout(function(){item.setVisible(true);},2000);
    }  
    item_factory(posX, posY, item){
        return this.physics.add.sprite(posX ,posY, item).setInteractive();
    }
}

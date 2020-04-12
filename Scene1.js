class Scene1 extends Phaser.Scene{
    constructor(){
        super("game1");
        this.dragX = 400;
        this.dragY = 500;
        this.dropX = 200;
        this.dropY = 200;
    }
    preload(){
        this.load.image('drag', 'image/35.png');
        this.load.image('drop', 'image/53.png');
    }
    create(){
        this.add.text(20,20,"Loading game1...");
        //create and display iten to canvas
        this.drop = this.physics.add.sprite(this.dropX ,this.dropY,'drop');
        this.drag = this.physics.add.sprite(this.dragX ,this.dragY,'drag').setInteractive();
        // this.dragCopy = this.physics.add.sprite(400 ,500,'drag');
        // this.dragCopy.setVisible(false);
        this.drag.setCollideWorldBounds(true);
        //allow items to be dragged
        this.input.setDraggable(this.drag);
        //invoke when start to drag
        this.input.on('dragstart', function (pointer,gameObject) {});
        //invoke when dragging
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            // console.log(this.drag.getBounds()+" "+this.drop.getBounds())
        });
        //invoke when release the dragging items
        this.input.on('dragend', function () {
            console.log("drag end");
            //create animation to return to original pos if invalid drop
            var timeline = this.tweens.createTimeline();
            timeline.add({
                targets: this.drag,
                x: 400,
                y: 500,
                ease: 'Power1',
                duration: 1000
            });
            timeline.play();
            //overlapping process: ****NEED TO MODIFY THIS SHIT RIGHT AWAY****
            var x = this.physics.add.overlap(this.drag,this.drop,this.callback,null,this);
        },this);
    }
    callback(){
        //set object to unDraggable
        this.input.setDraggable(this.drag,false);
        //create animation to place to exact pos
        var timeline = this.tweens.createTimeline();
            timeline.add({
                targets: this.drag,
                x: this.dropX+100,
                y: this.dropX,
                ease: 'Power1',
                duration: 1000
            });
            timeline.play();
    }  
}
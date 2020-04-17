class Scene1 extends Phaser.Scene{
    constructor(){
        super("game1");
        this.drag_X = 1200;
        this.drag_Y = 500;
        this.drop_X = 300;
        this.drop_Y = 200;
        this.check;
        this.overlapping = false;
    }
    preload(){
        this.load.image('next','image/back_icon.png');
        this.load.image('drag', 'image/35.png');
        this.load.image('drop', 'image/53.png');
        this.load.image('sound', 'image/loa.png');
        this.load.image('bag', 'image/41.png');
        
        this.load.audio('sfx','voice.mp3');
    }
    create(){
        this.add.text(20,20,"Loading game1...");
        // this.cameras.main.setBackgroundColor(0xDDDDD);
        this.voice = this.sound.add("sfx");
        // this.voice.play();
        //create next arrow but set it invisible and turn around
        this.sprite = this.add.sprite(700, 700, 'next').setInteractive();
        this.sprite.setVisible(false);
        this.sprite.angle = 180;

        //create and display items to canvas
        this.drop = this.physics.add.sprite(this.drop_X ,this.drop_Y,'drop').setOrigin(0,0);
        // this.sound = this.physics.add.sprite(this.drag_X ,this.drag_Y,'sound').setInteractive();
        // this.bag = this.physics.add.sprite(this.drag_X ,this.drag_Y,'bag').setInteractive();
        this.drag = this.physics.add.sprite(this.drag_X ,this.drag_Y,'drag').setInteractive();

        //scale items in canvas
        this.sprite.setScale(0.5);
        this.drop.setScale(1.5);
        this.drag.setScale(1.5);
        // this.bag.setScale(1.5);
        var zone = this.add.zone(this.drop_X + this.drop.displayWidth/4, this.drop_Y + this.drop.displayHeight/4).setRectangleDropZone(this.drop.displayWidth/2, this.drop.displayHeight/2);
        var graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(zone.x, zone.y, zone.input.hitArea.width, zone.input.hitArea.height);


        //set physics of the ball
        this.drag.setCollideWorldBounds(true);

        //allow items to be dragged
        this.input.setDraggable(this.drag);
        // this.input.setDraggable(this.drop);
        // this.input.setDraggable(this.sound);
        // this.input.setDraggable(this.bag);

        
        
        this.handler();
    }
    handler(){
        var ref = this;

        //invoke when dragging
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        //invoke the moment drop event occur, if not in the drop zone then execute
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.input.enabled = false;
            ref.animation(ref,dropZone.x + dropZone.input.hitArea.width/2,dropZone.y + dropZone.input.hitArea.height/2);
            //show the next button
            ref.change_state();
        });
    
        //invoke when drop, if in the drop zone then execute
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped) ref.animation(ref,ref.drag_X,ref.drag_Y);
        });

        
        
        //invoke when finish the valid pos
        this.sprite.on('pointerdown', function (pointer) {
            console.log("click");
            console.log(ref);
            ref.scene.start("game2");    
        });
        
        this.play_audio(ref.sound,ref.voice);
    }
    play_audio(item,audio){
        var ref = this;
        ref.audio = audio;
        ref.item = item;
        ref.item.on('pointerdown', function (pointer) {
            console.log("click");
            console.log(ref);
            ref.audio.play();   
        });
    }
    animation(ref,pos_x,pos_y){
        var timeline = ref.tweens.createTimeline();
                timeline.add({
                    targets: ref.drag,
                    x: pos_x,
                    y: pos_y,
                    ease: 'Power1',
                    duration: 1000
                });
                timeline.play();
    }
    change_state(){
        var ref = this;
        //set visible next button
        setTimeout(function(){ref.sprite.setVisible(true);},2000);
        console.log("end");
    }  
}
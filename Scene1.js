class Scene1 extends Phaser.Scene{
    constructor(){
        super("game1");
        this.drag_X = 1200;
        this.drag_Y = 500;
        this.drop_X = 300;
        this.drop_Y = 200;
        this.check;
        this.changeScene;
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
        this.drop = this.physics.add.sprite(this.drop_X ,this.drop_Y,'drop').setInteractive();
        this.sound = this.physics.add.sprite(this.drag_X ,this.drag_Y,'sound').setInteractive();
        this.bag = this.physics.add.sprite(this.drag_X ,this.drag_Y,'bag').setInteractive();
        this.drag = this.physics.add.sprite(this.drag_X ,this.drag_Y,'drag').setInteractive();

        //scale items in canvas
        this.sprite.setScale(0.5);
        this.drop.setScale(1.5);
        this.drag.setScale(1.5);
        this.bag.setScale(1.5);

        //set physics of the ball
        this.drag.setCollideWorldBounds(true);

        //allow items to be dragged
        this.input.setDraggable(this.drag);
        this.input.setDraggable(this.drop);
        this.input.setDraggable(this.sound);
        this.input.setDraggable(this.bag);


        
        

        this.handler();
    }
    handler(){
        //invoke when start to drag
        this.input.on('dragstart', function (pointer,gameObject) {});

        //invoke when dragging
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        //declare a this reference for convinient
        var ref = this;

        //invoke when release the dragging items
        // this.input.on('dragend', function () {
        //     //create animation to return to original pos if invalid drop
        //     this.animation(this,this.drag_X,this.drag_Y);
        //     console.log("drag end");
        //     //overlapping process: ****NEED TO MODIFY THIS SHIT RIGHT AWAY****
        //     var ref = this;
        //     ref.check = ref.physics.add.overlap(ref.drag,ref.drop,ref.callback,null,ref)
        // },ref);

        //invoke when finish the valid pos
        this.sprite.on('pointerdown', function (pointer) {
            console.log("click");
            console.log(ref);
            ref.scene.start("game2");    
        });
        //invoke when click to sound icon then play audio
        // this.sound.on('pointerdown', function (pointer) {
        //     console.log("click");
        //     console.log(ref);
        //     ref.voice.play();   
        // });
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
    callback(){
        //set object to unDraggable
        this.input.setDraggable(this.drag,false);

        //create animation to place to exact pos
        this.animation(this,this.drop_X+100,this.drop_Y);
        var ref = this;
        
        //set visible next button
        setTimeout(function(){ref.sprite.setVisible(true);},2000);

        console.log("end callback");
    }  
}
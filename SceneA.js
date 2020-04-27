
class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');
        this.drag_X = 1200;
        this.drag_Y = 800;
        this.drop_X = 250;
        this.drop_Y = 650;
    }


    create ()
    {
        this.text = this.add.text(500, 200, 'Put the ball in front of the bag', 
            {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#CCCCC',
                align: 'center',
                lineSpacing: 44,
            }
        );

        var Controller = this.scene.get('Controller');

        // this.dropFake = Controller.item_factory( this.drop_X-150, this.drop_Y-100, 'drop1').setOrigin(0,0);

        this.drop = Controller.item_factory ( this.drop_X, this.drop_Y, 'drop1').setOrigin(0,0);
        
        this.bag = Controller.item_factory( this.drop_X, this.drop_Y-350, 'bag').setOrigin(0,0); 

        this.sound = Controller.item_factory( 350, 170, 'sound').setOrigin(0,0); 

        this.voice = Controller.audio_factory('infront');

        this.drag = Controller.item_factory ( this.drag_X, this.drag_Y, 'drag');

        // this.drop0.setScale(1.5);
        this.drop.setScale(1.5);
        this.bag.setScale(1.5);
        this.drag.setScale(1.5);

        Controller.play_audio(this.sound,this.voice);

        Controller.setDraggable( this.drag);
        Controller.setDroppable( this.drop);
        Controller.setDroppable( this.dropFake);

        Controller.drag_and_drop(this.drag, this.drop, null);
    }

    
    invoke_next_scene(item){
        //clear all items in current scene
        this.clear_item();

        //change to next scene
        var Controller = this.scene.get('Controller');
        Controller.scene.launch("SceneB");
        item = Controller.scene.get("SceneB");
        return item;
    }
    
    clear_item(){
        var Controller = this.scene.get('Controller');
        Controller.clear_scene(this.drop0);
        Controller.clear_scene(this.drop);
        Controller.clear_scene(this.drag);
        Controller.clear_scene(this.bag);
        Controller.clear_scene(this.text);
        Controller.clear_scene(this.voice);
        Controller.clear_scene(this.sound);
    }
}
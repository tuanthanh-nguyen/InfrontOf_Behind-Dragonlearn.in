
class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('SceneB');
        this.drag_X = 1200;
        this.drag_Y = 800;
        this.drop_X = 250;
        this.drop_Y = 650;
    }


    create ()
    {
        this.text = this.add.text(500, 150, 'Put the ball behind the bag', { fontFamily: 'Verdana, Tahoma, serif' }, {fontSize: '60px'}, {color: 'black'} );

        var Controller = this.scene.get('Controller');

        this.drop0 = Controller.item_factory( this.drop_X-150, this.drop_Y-100, 'drop1').setOrigin(0,0);

        // this.drop = Controller.item_factory ( this.drop_X, this.drop_Y, 'drop1').setOrigin(0,0);

        this.drag = Controller.item_factory ( this.drag_X, this.drag_Y, 'drag');
        
        this.bag = Controller.item_factory( this.drop_X, this.drop_Y-350, 'bag').setOrigin(0,0);

        this.drop0.setScale(1.5);
        // this.drop.setScale(1.5);
        this.bag.setScale(1.5);
        this.drag.setScale(1.5);

        

        Controller.setDraggable( this.drag);
        Controller.setDroppable( this.drop);
        Controller.setDroppable( this.drop0);

        Controller.drag_and_drop(this.drag, this.drop0, null);
    }

    
    invoke_next_scene(item){
        //clear all items in current scene
        this.clear_item();

        //change to next scene
        var Controller = this.scene.get('Controller');
        Controller.scene.launch("SceneC");
        item = Controller.scene.get("SceneC");
        return item;
    }
    
    clear_item(){
        var Controller = this.scene.get('Controller');
        Controller.clear_scene(this.drop0);
        Controller.clear_scene(this.drop);
        Controller.clear_scene(this.drag);
        Controller.clear_scene(this.bag);
        Controller.clear_scene(this.text);
    }
}
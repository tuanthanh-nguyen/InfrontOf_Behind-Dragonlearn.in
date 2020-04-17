
class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');
        this.drag_X = 1200;
        this.drag_Y = 700;
        this.drop_X = 300;
        this.drop_Y = 500;
    }

    create ()
    {
        var Controller = this.scene.get('Controller');

        this.next_button = Controller.item_factory(900, 700,'next_button');
        this.next_button.setVisible(false);
        this.next_button.angle = 180;

        this.drop = Controller.item_factory(this.drop_X,this.drop_Y,'drop').setOrigin(0,0)
        this.drag = Controller.item_factory(this.drag_X,this.drag_Y,'drag');

        this.next_button.setScale(0.5);
        this.drop.setScale(1.5);
        this.drag.setScale(1.5);
        

        Controller.setDraggable(this.drag);
        Controller.setDroppable(this.drop);

        Controller.drag_and_drop(this.drag,this.drop,this.next_button);
    }
}
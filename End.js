class End extends Phaser.Scene{
    
    constructor(){
        super('End');
    }

    create(){
        var Controller = this.scene.get("Controller");

        this.end = Controller.item_factory ( this.cameras.main.centerX, this.cameras.main.centerY, 'end');

        this.end.setScale(0.5);
    }
}
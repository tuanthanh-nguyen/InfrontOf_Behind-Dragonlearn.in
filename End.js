class End extends Phaser.Scene{
    
    constructor(){
        super('End');
    }

    create(){
        var Controller = this.scene.get("Controller");
        this.end = Controller.item_factory ( 200, 400, 'end').setOrigin(0,0)
        console.log("it is me end scene");
    }
}
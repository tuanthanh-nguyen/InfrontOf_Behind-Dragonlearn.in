class Scene2 extends Phaser.Scene{
    constructor(){
        super("game2");
    }
    create(){
        // this.bag = this.add.image(100,100,"bag");
        // this.bag.setOrigin(0,0);
        this.add.text(20,20,"Loading game2...");
    }
}
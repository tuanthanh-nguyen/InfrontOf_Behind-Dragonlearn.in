class End extends Phaser.Scene{
    
    constructor(){
        super('End');
    }

    create(){
        var Controller = this.scene.get("Controller");

        this.text = this.add.text(600, 200, 'Well done! You completed the card!', 
            {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#CCCCC',
                align: 'center',
                lineSpacing: 44,
            }
        );

        this.end = Controller.item_factory ( this.cameras.main.centerX, this.cameras.main.centerY, 'end');

        this.end.setScale(0.5);
    }
}
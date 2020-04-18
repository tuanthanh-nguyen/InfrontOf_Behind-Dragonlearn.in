class End extends Phaser.Scene{
    
    constructor(){
        super('End');
    }

    // preload(){
    //     this.preload.image('end', 'image/icon_logo.jpg');
    // }


    create(){
        this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'end');
    }
}
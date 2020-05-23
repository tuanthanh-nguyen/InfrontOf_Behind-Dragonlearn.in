class Controller extends Phaser.Scene{
    constructor(){
        super("Controller");
    }


    preload(){
        this.load.svg('next_button','../image/38.svg',{width:"200", height:"200"});
        this.load.svg('ball', '../image/35.svg',{width:"150", height:"150"});
        this.load.svg('book', '../image/39.svg',{width:"300", height:"300"});
        this.load.svg('drop', '../image/53.svg',{width:"500", height:"500"});
        this.load.svg('drop1', '../image/55.svg',{width:"500", height:"500"});
        this.load.svg('bag', '../image/41.svg',{width:"500", height:"500"});
        this.load.svg('cactus', '../image/45.svg',{width:"400", height:"400"});
        this.load.svg('sound', '../image/loa.svg',{width:"100", height:"100"});
        this.load.svg('play', '../image/play_button.svg',{width:"400", height:"400"});
        this.load.svg('arrow', '../image/arrow.svg',{width:"100", height:"100"});

        this.load.svg('road', '../image/42.svg',{width: "2000", height: "2000"})
        this.load.svg('circle_drop', '../image/334.svg',{width: "200", height: "200"})
        this.load.svg('lions', '../image/354.svg',{width: "300", height: "300"})
        this.load.svg('wolf', '../image/48.svg',{width: "200", height: "200"})
    }


    create(){
        this.scene_opening();
    }


    scene_opening(){
        let scenemng = this.scene.get("SceneManager");
        let controller = this.scene.get("Controller");

        controller.start_button = controller.physics.add.sprite(controller.cameras.main.centerX, 
            controller.cameras.main.centerY, 'play').setInteractive({ pixelPerfect: true}).setOrigin(0.5);

        controller.start_button.once('pointerup', function(){    
            scenemng.create_game();

            controller.destroy(controller.start_button);
        });
    }
    /**
     * return an int number from range
     * @param {number} min 
     * @param {number} max 
     */
    get_random_int(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * decontructor an item
     * @param {Phaser.Object} item 
     */
    destroy(item){
        if(item!=null) {
            item.destroy(true);
            item = null;
        }
    }
}

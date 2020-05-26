// console.log(window.game.scene.scenes[0]);
class Controller extends Phaser.Scene{
    constructor(){
        super("Controller");     
    }
    preload(){
        this.load.svg('ball', '../assets/35.svg',{width:"150", height:"150"});
        this.load.svg('book', '../assets/39.svg',{width:"300", height:"300"});
        this.load.svg('drop', '../assets/53.svg',{width:"500", height:"500"});
        this.load.svg('drop1', '../assets/55.svg',{width:"500", height:"500"});
        this.load.svg('bag', '../assets/41.svg',{width:"500", height:"500"});
        this.load.svg('cactus', '../assets/45.svg',{width:"400", height:"400"});
        this.load.svg('sound', '../assets/loa.svg',{width:"100", height:"100"});
        this.load.svg('play', '../assets/play_button.svg',{width:"400", height:"400"});
    }
    create(){
        init_scope();
        this.scene_opening();
    }
    scene_opening(){
        //init start button
        this.start_button = this.physics.add.sprite(this.cameras.main.centerX, 
            this.cameras.main.centerY, 'play').setInteractive({ pixelPerfect: true}).setOrigin(0.5);

        this.start_button.once('pointerup', () => {    
            scnmng.create_game(Game1);
            scnmng.destroy(this.start_button);
        });
    }
}
const Game1 = {
    obstacle_item: [
        {
            item: 'bag',
            X: 250,
            Y: 320,
        },
        {
            item: 'cactus',
            X: 300,
            Y: 400,
        }
    ],
    drop_item: [
        {
            item: 'drop',
            description: 'in front of',
            DROPX: 250,
            DROPY: 500
        },
        {
            item: 'drop1',
            description: 'behind of',
            DROPX: 250,
            DROPY: 500
        }
    ],
    drag_item: [
        {
            item: 'ball',
            DRAGX: 1200,
            DRAGY: 700,
            infront: [450, 650],
            behind: [330, 540]
        },
        {
            item: 'book',
            DRAGX: 1200,
            DRAGY: 700,
            infront: [450, 650],
            behind: [330, 500]
        }
    ],
}
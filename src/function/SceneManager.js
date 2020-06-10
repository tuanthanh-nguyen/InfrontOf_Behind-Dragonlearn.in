class SceneManager extends Phaser.Scene{
    constructor(){
        super("SceneManager");
    }
    //Set property of item
    /**
     * make item draggable
     * @param {spriteArcade} dragItem -  set the property if the item is draggable
     */
    set_draggable  (dragItem)  {
        if(dragItem === null || dragItem === undefined) return;
        controller.physics.world.bounds.setTo(/*margin left*/0, /*margin up*/150, /*width*/this.cameras.main.width, /*height - offSet*/this.cameras.main.height - 150);
        //set physics of the ball
        dragItem.setCollideWorldBounds(true, true, true, true);
        //allow items to be dragged
        controller.input.setDraggable(dragItem);
    }
    /**
     * make item droppable
     * @param {spriteArcade} dragItem -  set the property if the item is droppable
     */
    set_droppable  (dropItem)  {
        //set drop item
        if(dropItem === null || dropItem === undefined) return;
        dropItem.input.dropZone = true;
    }
    /**
     * function to create a game scene
     * @param {config} game - basically just numbers and stuffs with specific patterns required 
     */
    create_game(game){  
        if(game === null || game === undefined) return;
        this.create_drop_item(game);
        this.create_obstacle_item(game);
        this.create_drag_item(game);
        //set property 
        this.set_draggable( this.get_drag_item().sprite);
        this.set_droppable( controller.drop_item[0].sprite);
        this.set_droppable( controller.drop_item[1].sprite);
        //in front or behind case     --this must be initialize after initializing dropzone and drag_item--
        this.set_case();
        //setting up text
        this.create_sentence();
        controller.sound = this.item_factory( /* preset posX */550, /* preset posY */170, 'sound');
        //setting up sound
        speaker.say(controller.sound, this.get_statement());
        speaker.say(controller.sentence.text, this.get_statement());
        //animation comes fade
        anmt.animation_fade_screen('fade in', /*preset duration */200 );
    }
    create_drop_item(game){
        if(game === null || game === undefined) return;
        //setting up dropping zone
        controller.drop_item = [];
        for(let i = 0; i < game.drop_item.length ; i++){
            controller.drop_item[i] = {
                item: game.drop_item[i].item,
                description: game.drop_item[i].description,
                case: false,
                sprite: null,
                init: () => controller.drop_item[i].sprite = this.item_factory(game.drop_item[i].DROPX, game.drop_item[i].DROPY, game.drop_item[i].item)./* set back to dimension */setDepth(-1)
            }
            controller.drop_item[i].init();
        }
    }
    create_obstacle_item(game){
        if(game === null || game === undefined) return;
        controller.obstacle_item = [];
        for(let i = 0; i < game.obstacle_item.length ; i++){
            controller.obstacle_item[i] = {
                item: game.obstacle_item[i].item,
                flag: false,
                sprite: null,
                init: () => {
                    controller.obstacle_item[i].sprite = this.item_factory(game.obstacle_item[i].X, game.obstacle_item[i].Y, game.obstacle_item[i].item)
                    controller.obstacle_item[i].flag = true;
                }
            }
        }
        controller.obstacle_item[this.get_random_int(0,1)].init();
    }
    create_drag_item(game){
        if(game === null || game === undefined) return;
        controller.drag_item = [];
        for(let i = 0; i < game.drag_item.length ; i++){
            controller.drag_item[i] = {
                item: game.drag_item[i].item,
                dragX: game.drag_item[i].DRAGX,
                dragY: game.drag_item[i].DRAGY,
                offSet: [
                    {
                        X: game.drag_item[i].infront[0],
                        Y: game.drag_item[i].infront[1],
                    },
                    {
                        X: game.drag_item[i].behind[0],
                        Y: game.drag_item[i].behind[1],
                    }
                ],
                flag: false,
                sprite: null,
                init: () =>  {
                    controller.drag_item[i].sprite = this.item_factory(game.drag_item[i].DRAGX, game.drag_item[i].DRAGY, game.drag_item[i].item);
                    controller.drag_item[i].flag = true;
                }
            }
        }
        controller.drag_item[this.get_random_int(0,1)].init();
    }
    create_sentence(){
        controller.sentence = {
            text: null,
            init: () => controller.sentence.text = this.generate_text(/* preset posX */700, /* preset posY */200, this.get_statement(), '40px', /* white */'#AAAAAAA')
        }
        controller.sentence.init();
    }
    generate_text(posX, posY, context, size, color){
        return controller.add.text(posX, posY, context, 
        {
            fontSize: size,
            fontFamily: 'Arial',
            color: color,
            align: 'center',
            lineSpacing: 44,
        }
        ).setInteractive({ useHandCursor: true });
    }
    get_obstacle_item(){
        for(let i = 0; i < controller.obstacle_item.length; i++){
            if(controller.obstacle_item[i].flag === true)
                return controller.obstacle_item[i];
        }
    }
    get_drag_item(){
        for(let i = 0; i < controller.drag_item.length; i++){
            if(controller.drag_item[i].flag === true)
                return controller.drag_item[i];
        }
    }
    set_case(){
        controller.drop_item[this.get_random_int(0,1)].case = true;
        if(controller.drop_item[0].case === true)
            handler.drag_and_drop(this.get_drag_item(), controller.drop_item[0], controller.drop_item[1]);
        else
            handler.drag_and_drop(this.get_drag_item(), controller.drop_item[1], controller.drop_item[0]);
    }
    get_case(){
        for(let i = 0; i < controller.drop_item.length; i++){
            if(controller.drop_item[i].case === true)
                return controller.drop_item[i].description;
        }
    }
    get_case_index(){
        for(let i = 0; i < controller.drop_item.length; i++){
            if(controller.drop_item[i].case === true)
                return i;
        }
    }
    get_statement(){
        return 'Put the ' + this.get_drag_item().item + ' ' + this.get_case() + ' the ' + this.get_obstacle_item().item
    }
    clear_current_game(){
        for(let i = 0; i < controller.drop_item.length ; i++){
            this.destroy(controller.drop_item[i].sprite);
        }
        this.destroy(this.get_drag_item().sprite);
        this.destroy(this.get_obstacle_item().sprite);
        this.destroy(controller.sound);
        this.destroy(controller.sentence.text);  
        this.destroy(controller.road);  
    }
    /**
     * generate item like sprite, image phaser
     * @param {number} posX - x coordinate in canvas
     * @param {number} posY - y coordinate in canvas
     * @param {spriteArcade} item - sprite wish to create
     */
    item_factory(posX, posY, item){
        //default for error arg
        if(posX === null || posX === undefined) posX = 0;
        if(posY === null || posY === undefined) posY = 0;
        if(item === null || item === undefined) item = 'process_ball';
        return controller.physics.add.sprite(posX ,posY, item).setInteractive({ pixelPerfect: true}).setOrigin(0,0);
    }
    /**
     * return an int number from range
     * @param {number} min 
     * @param {number} max 
     */
    get_random_int(min, max) {
        if(min === null || min === undefined) min = 0;
        if(max === null || max === undefined) max = 1;
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * decontructor an item
     * @param {Phaser.Object} item 
     */
    destroy(item){
        if(item === null || item === undefined) return;
        item.destroy(true);
        item = null;
    }
}
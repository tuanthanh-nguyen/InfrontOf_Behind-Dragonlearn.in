class SceneManager extends Phaser.Scene{
    constructor(){
        super("SceneManager");
    }

    //Getter and setter function//
    /*
        Since the phaser has kinda a mixture of JS ES6 and the game canvas only operate in one scope which acts as a class.
        In here, i choose the controller class as the inter-mediate class to run the game.
        As a result, other classes have to borrow the scope of each others in order to be fully functional.
    */
   /**
    * the scope of other classes
    */
    get_controller(){
        if(this.controller === undefined) this.controller = this.scene.get('Controller');
        return this.controller;
    }
    get_uiscene(){
        if(this.uiscene === undefined) this.uiscene = this.scene.get('UIScene');
        return this.uiscene;
    }
    get_anmt(){
        if(this.anmt === undefined) this.anmt = this.scene.get('Animation');
        return this.anmt;
    }
    get_handler(){
        if(this.handler === undefined) this.handler = this.scene.get('Handler');
        return this.handler;
    }
    get_speaker(){
        if(this.speaker === undefined) this.speaker = this.scene.get('Speaker');
        return this.speaker;
    }
    //Set property of item
    /**
     * make item draggable
     * @param {spriteArcade} dragItem -  set the property if the item is draggable
     */
    set_draggable  (dragItem)  {
        if(dragItem === null || dragItem === undefined) return;
        //set physics of the ball
        dragItem.setCollideWorldBounds(true);
        //allow items to be dragged
        this.get_controller().input.setDraggable(dragItem);
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
        console.log(game);
        this.create_drop_item(game);
        this.create_obstacle_item(game);
        this.create_drag_item(game);
        //set property 
        this.set_draggable( this.get_drag_item().sprite);
        this.set_droppable( this.get_controller().drop_item[0].sprite);
        this.set_droppable( this.get_controller().drop_item[1].sprite);
        //in front or behind case     --this must be initialize after initializing dropzone and drag_item--
        this.set_case();
        //setting up text
        this.create_sentence();
        this.get_controller().sound = this.item_factory( /* preset posX */550, /* preset posY */170, 'sound');
        //setting up sound
        this.get_speaker().say(this.get_controller().sound, this.get_statement());
        this.get_speaker().say(this.get_controller().sentence.text, this.get_statement());
        //animation comes fade
        this.get_anmt().animation_fade_screen('fade in', /*preset duration */200 );
    }
    create_drop_item(game){
        console.log('hey')
        //setting up dropping zone
        this.get_controller().drop_item = [];
        for(let i = 0; i < game.drop_item.length ; i++){
            this.get_controller().drop_item[i] = {
                item: game.drop_item[i].item,
                description: game.drop_item[i].description,
                case: false,
                sprite: null,
                init: () => this.get_controller().drop_item[i].sprite = this.item_factory(game.drop_item[i].DROPX, game.drop_item[i].DROPY, game.drop_item[i].item)./* set back to dimension */setDepth(-1)
            }
            this.get_controller().drop_item[i].init();
        }
    }
    create_obstacle_item(game){
        this.get_controller().obstacle_item = [];
        for(let i = 0; i < game.obstacle_item.length ; i++){
            this.get_controller().obstacle_item[i] = {
                item: game.obstacle_item[i].item,
                flag: false,
                sprite: null,
                init: () => {
                    this.get_controller().obstacle_item[i].sprite = this.item_factory(game.obstacle_item[i].X, game.obstacle_item[i].Y, game.obstacle_item[i].item)
                    this.get_controller().obstacle_item[i].flag = true;
                }
            }
        }
        this.get_controller().obstacle_item[this.get_random_int(0,1)].init();
    }
    create_drag_item(game){
        this.get_controller().drag_item = [];
        for(let i = 0; i < game.drag_item.length ; i++){
            this.get_controller().drag_item[i] = {
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
                    this.get_controller().drag_item[i].sprite = this.item_factory(game.drag_item[i].DRAGX, game.drag_item[i].DRAGY, game.drag_item[i].item);
                    this.get_controller().drag_item[i].flag = true;
                }
            }
        }
        this.get_controller().drag_item[this.get_random_int(0,1)].init();
    }
    create_sentence(){
        this.get_controller().sentence = {
            text: null,
            init: () => this.get_controller().sentence.text = this.get_controller().add.text(/* preset posX */700, /* preset posY */200, this.get_statement(), 
                {
                    fontSize: '40px',
                    fontFamily: 'Arial',
                    color: '#AAAAAAA',
                    align: 'center',
                    lineSpacing: 44,
                }
            ).setInteractive({ useHandCursor: true })
        }
        this.get_controller().sentence.init();
    }
    get_obstacle_item(){
        for(let i = 0; i < this.get_controller().obstacle_item.length; i++){
            if(this.get_controller().obstacle_item[i].flag === true)
                return this.get_controller().obstacle_item[i];
        }
    }
    get_drag_item(){
        for(let i = 0; i < this.get_controller().drag_item.length; i++){
            if(this.get_controller().drag_item[i].flag === true)
                return this.get_controller().drag_item[i];
        }
    }
    set_case(){
        this.get_controller().drop_item[this.get_random_int(0,1)].case = true;
        if(this.get_controller().drop_item[0].case === true)
            this.get_handler().drag_and_drop(this.get_drag_item().sprite, this.get_controller().drop_item[0].sprite, this.get_controller().drop_item[1].sprite);
        else
            this.get_handler().drag_and_drop(this.get_drag_item().sprite, this.get_controller().drop_item[1].sprite, this.get_controller().drop_item[0].sprite);
    }
    get_case(){
        for(let i = 0; i < this.get_controller().drop_item.length; i++){
            if(this.get_controller().drop_item[i].case === true)
                return this.get_controller().drop_item[i].description;
        }
    }
    get_case_index(){
        for(let i = 0; i < this.get_controller().drop_item.length; i++){
            if(this.get_controller().drop_item[i].case === true)
                return i;
        }
    }
    get_statement(){
        return 'Put the ' + this.get_drag_item().item + ' ' + this.get_case() + ' the ' + this.get_obstacle_item().item
    }
    clear_current_game(){
        for(let i = 0; i < this.get_controller().drop_item.length ; i++){
            this.get_controller().destroy(this.get_controller().drop_item[i].sprite);
        }
        this.get_controller().destroy(this.get_drag_item().sprite);
        this.get_controller().destroy(this.get_obstacle_item().sprite);
        this.get_controller().destroy(this.get_controller().sound);
        this.get_controller().destroy(this.get_controller().sentence.text);  
        this.get_controller().destroy(this.get_controller().road);  
    }
    /**
     * generate item like sprite, image phaser
     * @param {number} posX - x coordinate in canvas
     * @param {number} posY - y coordinate in canvas
     * @param {spriteArcade} item - sprite wish to create
     */
    item_factory(posX, posY, item){
        return this.get_controller().physics.add.sprite(posX ,posY, item).setInteractive({ pixelPerfect: true}).setOrigin(0,0);
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
}
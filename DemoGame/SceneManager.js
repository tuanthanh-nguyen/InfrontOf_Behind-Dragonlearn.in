class SceneManager extends Phaser.Scene{
    constructor(){
        super("SceneManager");
        const _DROPX_ = 250;
        const _DROPY_ = 500;
        const _DRAGX_ = 1200;
        const _DRAGY_ = 700;
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
        if(dropItem != null) 
            dropItem.input.dropZone = true;
    }


    create_game(){  
        this.create_drop_item();
        this.create_obstacle();
        this.create_drag_item();
        //set property 
        this.set_draggable( this.get_drag_item().sprite);
        this.set_droppable( this.get_controller().drop[0].sprite);
        this.set_droppable( this.get_controller().drop[1].sprite);
        //in front or behind case     --this must be initialize after initializing dropzone and drag_item--
        this.set_case();
        //setting up text
        this.create_sentence();
        this.get_controller().sound = this.item_factory( /* preset posX */550, /* preset posY */170, 'sound');
        //setting up sound
        this.get_speaker().say(this.get_controller().sound, this.get_statement());
        this.get_speaker().say(this.get_controller().sentence.text, this.get_statement());
        //animation comes fade
        this.get_anmt().animation_fade_screen('fade in', /* duration */1000 );
    }
    create_drop_item(){
        //setting up dropping zone
        this.get_controller().drop = [];
        //infront is case 0
        this.get_controller().drop[0] = {
            item: 'drop',
            description: "in front of",
            case: false,
            sprite: null,
            init: () => this.get_controller().drop[0].sprite = this.item_factory(/* _DROPX_ */250, /* _DROPY_ */500, "drop")./* set back to dimension */setDepth(-1)
        };
        this.get_controller().drop[0].init();
        //behind is case 1 
        this.get_controller().drop[1] = {
            item: 'drop1',
            description: "behind of",
            case: false,
            sprite: null,
            init: () => this.get_controller().drop[1].sprite = this.item_factory(/* _DROPX_ */250, /* _DROPY_ */500, "drop1")./* set back to dimension */setDepth(-1)
        };
        this.get_controller().drop[1].init();
    }
    
    create_obstacle(){
        this.get_controller().obstacle_item = [];
        this.get_controller().obstacle_item[0] = {
            item: 'bag',
            offsetX: 0,         //preset-for better placement in relative
            offsetY: -180,       //preset-for better placement in relative
            flag: false,
            sprite: null,
            init: () => {
                this.get_controller().obstacle_item[0].sprite = this.item_factory(/* _DROPX_ */250 + /* offsetX */0, /* _DROPY_ */500 + /* offsetY */-180, /* item */'bag')
                this.get_controller().obstacle_item[0].flag = true;
            }
        }
        this.get_controller().obstacle_item[1] = {
            item: 'cactus',
            offsetX: 50,         //preset-for better placement in relative
            offsetY: -100,       //preset-for better placement in relative
            flag: false,
            sprite: null,
            init: () => {
                this.get_controller().obstacle_item[1].sprite = this.item_factory(/* _DROPX_ */250 + /* offsetX */50, /* _DROPY_ */500 + /* offsetY */-100, /* item */'cactus')
                this.get_controller().obstacle_item[1].flag = true;
            }
        }
        this.get_controller().obstacle_item[this.get_controller().get_random_int(0,1)].init();
    }
    create_drag_item(){
        this.get_controller().drag = [];
        this.get_controller().drag[0] = {
            item: 'ball',
            offSet: [
                {
                    X: 450,     //preset-for true pos only
                    Y: 650      //preset-for true pos only
                },
                {   
                    X: 330,     //preset-for true pos only
                    Y: 540      //preset-for true pos only
                }   
            ],
            flag: false,
            sprite: null,
            init: () =>  {
                this.get_controller().drag[0].sprite = this.item_factory(/* _DRAGX_ */1200, /* _DRAGY_ */700, /* item */'ball');
                this.get_controller().drag[0].flag = true;
            }
        };
        this.get_controller().drag[1] = {
            item: 'book',
            offSet:[
                {
                    X: 450,     //preset-for true pos only
                    Y: 650      //preset-for true pos only
                },
                {
                    X: 330,     //preset-for true pos only
                    Y: 500      //preset-for true pos only
                }
            ],
            flag: false,
            sprite: null,
            init: () =>  {
                this.get_controller().drag[1].sprite = this.item_factory(/* _DRAGX_ */1200, /* _DRAGY_ */700, /* item */'book');
                this.get_controller().drag[1].flag = true;
            }
        };
        this.get_controller().drag[this.get_controller().get_random_int(0,1)].init();
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
        for(let i = 0; i < this.get_controller().drag.length; i++){
            if(this.get_controller().drag[i].flag === true)
                return this.get_controller().drag[i];
        }
    }
    set_case(){
        this.get_controller().drop[this.get_controller().get_random_int(0,1)].case = true;
        if(this.get_controller().drop[0].case === true)
            this.get_handler().drag_and_drop(this.get_drag_item().sprite, this.get_controller().drop[0].sprite, this.get_controller().drop[1].sprite);
        else
            this.get_handler().drag_and_drop(this.get_drag_item().sprite, this.get_controller().drop[1].sprite, this.get_controller().drop[0].sprite);
    }
    get_case(){
        for(let i = 0; i < this.get_controller().drop.length; i++){
            if(this.get_controller().drop[i].case === true)
                return this.get_controller().drop[i].description;
        }
    }
    get_case_index(){
        for(let i = 0; i < this.get_controller().drop.length; i++){
            if(this.get_controller().drop[i].case === true)
                return i;
        }
    }
    get_statement(){
        return 'Put the ' + this.get_drag_item().item + ' ' + this.get_case() + ' the ' + this.get_obstacle_item().item
    }
    clear_current_game(){
        this.get_controller().destroy(this.get_controller().drop[0].sprite);
        this.get_controller().destroy(this.get_controller().drop[1].sprite);
        this.get_controller().destroy(this.get_drag_item().sprite);
        this.get_controller().destroy(this.get_obstacle_item().sprite);
        this.get_controller().destroy(this.get_controller().sound);
        this.get_controller().destroy(this.get_controller().sentence.text);  
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
}
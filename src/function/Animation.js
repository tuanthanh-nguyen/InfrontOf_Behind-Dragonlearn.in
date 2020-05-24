class Animation extends Phaser.Scene{
    constructor(){
        super("Animation");
    }
    //Getter and setter function//
    /*
        Since the phaser has kinda a mixture of JS ES6 and the game canvas only operate in one scope which acts as a class.
        In here, i choose the controller class as the inter-mediate class to run the game.
        As a result, other classes have to borrow the scope of each others in order to be fully functional.
    */
    get_controller(){
        if(this.controller === undefined) this.controller = this.scene.get('Controller');
        return this.controller;
    }
    get_uiscene(){
        if(this.uiscene === undefined) this.uiscene = this.scene.get('UIScene');
        return this.uiscene;
    }
    get_scnmng(){
        if(this.scnmng === undefined) this.scnmng = this.scene.get('SceneManager');
        return this.scnmng;
    }
    get_handler(){
        if(this.handler === undefined) this.handler = this.scene.get('Handler');
        return this.handler;
    }
    /**
     * move the object from one place to another place
     * @param {Phaser.Object} item - item to move
     * @param {number} pos_x    - x coordinate in canvas
     * @param {number} pos_y    - y coordinate in canvas
     * @param {time} duration   - interval from start to finish
     */
    animation_move(item, pos_x, pos_y, duration){
        this.get_controller().tweens.add({
            targets: item,
            x: pos_x,
            y: pos_y,
            ease: 'Power1',
            duration: duration,
        });

    }

    /**
     * fade a single item 
     * @param {Phaser.Object} item - item to fade 
     * @param {boolean} flag - for specified the type of fading 
     * @param {number} duration - time interval till end changing tint color
     */
    animation_fade_item(item,flag,duration){
        if(item === null || item === undefined) return;
        let v1 = 0, v2 = 1;
        if(flag == 'fade out') {
            v1 = 1;
            v2 = 0;
        }
        this.get_controller().tweens.add({
            targets: item,
            alpha: { start: v1, to: v2 },
            ease: 'Linear',
            duration: duration,
        });

    }

    /**
     * bounce the object with offset that relative to current position
     * @param {spriteArcade} item - could be image, svg file derivation and convert to Phaser.Sprite
     * @param {number} offSetX - bounce relative to this offset coordinate
     * @param {number} offSetY - bounce relative to this offset coordinate
     */
    animation_bounce(item, offSetX, offSetY){
        this.get_controller().tweens.add({
            targets: item,
            x: offSetX,
            y: offSetY,
            ease: 'Power1',
            duration: 500,
            yoyo: true,
            repeat: 1
        });
    }

    /**
     * move to the true position
     * @param {spriteArcade} item - could be image, svg file derivation and convert to Phaser.Sprite
     */
    animation_true_pos(item){
        let ref = this.get_scnmng();
        let offSetX = ref.get_drag_item().offSet[ref.get_case_index()].X;
        let offSetY = ref.get_drag_item().offSet[ref.get_case_index()].Y;
        this.animation_move(item, offSetX , offSetY , /* preset duration */1000)
        setTimeout(() => this.animation_bounce(item, offSetX, offSetY -/*preset bouncing vertically*/50), /* preset time trigger */3000);
    }
    /**
     * for changing tint of objects
     * @param {Phaser.Object} item - could be anything of Phaser object
     * @param {color[3]} color     - color must be an array with 3 elements denotes 3 rgb colors
     * @param {number} duration         - time interval till end changing tint color
     */
    animation_alert(item, color, duration){
        this.get_controller().tweens.addCounter({
            from: 255,
            to: 0,
            duration: duration,
            onUpdate: () => item.setTint(Phaser.Display.Color.GetColor(color[0], color[1], color[2])),
            onComplete: () => item.clearTint()
        });
    }

    /**
     * for changing tint of objects
     * @param {Phaser.Object} item - could be anything of Phaser object
     * @param {color[3]} color     - color must be an array with 3 elements denotes 3 rgb colors
     * @param {number} duration    - time interval till end changing tint color
     */
    animation_hint(item, color, duration){
        this.animation_alert(item, color, duration);
    }
    /**
     * fading some specific items
     * @param {boolean || String} flag - for specified the type of fading 
     * @param {number} duration        - time interval till end changing tint color
     */
    animation_fade_screen(flag, duration){
        this.animation_fade_item(this.get_scnmng().get_drag_item().sprite, flag, duration);
        for(let i = 0; i < this.get_controller().drop_item.length ; i++){
            this.animation_fade_item(this.get_controller().drop_item[i].sprite, flag, duration);
        }
        this.animation_fade_item(this.get_controller().sound, flag, duration);
        this.animation_fade_item(this.get_scnmng().get_obstacle_item().sprite, flag, duration);
        this.animation_fade_item(this.get_controller().sentence.text, flag, duration);
        this.animation_fade_item(this.get_controller().road, flag, duration);
    }
}

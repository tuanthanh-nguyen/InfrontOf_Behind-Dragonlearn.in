class Animation extends Phaser.Scene{
    constructor(){
        super("Animation");
    }
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

    animation_move(item, pos_x, pos_y, duration){
        this.get_controller().tweens.add({
            targets: item,
            x: pos_x,
            y: pos_y,
            ease: 'Power1',
            duration: duration,
        });

    }


    animation_fade_item(item,flag,duration){
        // let controller = this.scene.get('controller');

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


    animation_true_pos(item){
        let offSetX = this.get_scnmng().get_drag_item().offSet[this.get_scnmng().get_case_index()].X;
        let offSetY = this.get_scnmng().get_drag_item().offSet[this.get_scnmng().get_case_index()].Y;
        this.animation_move(item, offSetX , offSetY , 1000)
    
        //if the dropzone is behind then set obstacle to front
        if(this.get_scnmng().get_case_index() == 1){
            item.setDepth(0);
            this.get_scnmng().get_obstacle_item().sprite.setDepth(1);
        }
        else{
            item.setDepth(1);
            this.get_scnmng().get_obstacle_item().sprite.setDepth(0);
        }
        setTimeout(() =>
            this.animation_bounce(item, offSetX, offSetY -/*preset bouncing vertically*/50)
        ,3000);
    }

    animation_alert(){
        //TODO: alert when player chose wrong position
        console.log('iam here')
    }


    animation_tutorial(){
        this.get_controller().copy = this.get_scnmng().item_factory(/* dragX */1200, /* dragY */700, 
            /* this.get_controller().drag[this.get_controller().dragType].item */this.get_scnmng().get_drag_item().item)./*make it invisible*/setAlpha(0);
        
        this.get_controller().copy.setAlpha(/*alpha preset*/0.4);
        this.animation_true_pos(this.get_controller().copy, /*duration preset*/5000);
        this.animation_fade_item(this.get_controller().copy, 'fade out', /*duration preset*/3000);

        setTimeout( () => this.get_controller().destroy(this.get_controller().copy),/*duration preset*/6000);
        
    }

    animation_fade_screen(flag, duration){
        this.animation_fade_item(this.get_scnmng().get_drag_item().sprite, flag, duration);
        this.animation_fade_item(this.get_controller().drop[0].sprite, flag, duration);
        this.animation_fade_item(this.get_controller().drop[1].sprite, flag, duration);
        this.animation_fade_item(this.get_controller().sound, flag, duration);
        this.animation_fade_item(this.get_scnmng().get_obstacle_item().sprite, flag, duration);
        this.animation_fade_item(this.get_controller().sentence.text, flag, duration);
    }
}

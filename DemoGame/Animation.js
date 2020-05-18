class Animation extends Phaser.Scene{
    constructor(){
        super("Animation");
    }
    test(){
        return 1;
    }


    animation_move(item, pos_x, pos_y, duration){
        const controller = this.scene.get('Controller');

        const timeline = controller.tweens.createTimeline();
            timeline.add({
                targets: item,
                x: pos_x,
                y: pos_y,
                ease: 'Power1',
                duration: duration,
            });
        timeline.play();
    }


    animation_fade_item(item,flag,duration){
        const controller = this.scene.get('Controller');

        let v1 = 0, v2 = 1;
        if(flag == 'fade out') {
            v1 = 1;
            v2 = 0;
        }
        const timeline = controller.tweens.createTimeline();
            timeline.add({
                targets: item,
                alpha: { start: v1, to: v2 },
                ease: 'Linear',
                duration: duration,
            });
        timeline.play();
    }


    animation_correct(item, offSet){
        const controller = this.scene.get('Controller');

        controller.tweens.add({
            targets: item,
            y: offSet - 50,
            ease: 'Power1',
            duration: 500,
            yoyo: true,
            repeat: 1
        });
    }


    animation_true_pos(item){
        // var anmt = this;
        const controller = this.scene.get('Controller');

        const offSetX = controller.drop[controller.caseType].x + controller.drop[controller.caseType].width/2 
        const offSetY = controller.drop[controller.caseType].y + controller.drop[controller.caseType].width/2 

        this.animation_move(item, offSetX + controller.drag[controller.dragType].offSet[controller.caseType].X, 
            offSetY + controller.drag[controller.dragType].offSet[controller.caseType].Y, 1000)
    
        //if the dropzone is behind then set obstacle to front
        if(controller.caseType == 1){
            item.setDepth(0);
            controller.obstacle_item.setDepth(1);
        }
        else{
            item.setDepth(1);
            controller.obstacle_item.setDepth(0);
        }
        setTimeout(function(){this.animation_correct(item, offSetY + controller.drag[controller.dragType].offSet[controller.caseType].Y)},3000);
    }

    animation_alert(){
        // var anmt = this;
        const controller = this.scene.get('Controller');
        const scenemng = this.scene.get('SceneManager');

        controller.arrow = scenemng.item_factory(/*posX =*/1050, /*posY =*/500, /*item =*/'arrow');
        controller.arrow.angle = 90;
        this.animation_move(controller.arrow, /*posX =*/1050, /*posY =*/250, /*duration =*/3000);
        this.animation_fade_item(controller.arrow, 'fade out', 3000);

        setTimeout(function(){controller.destroy(controller.arrow);},4000);
    }


    animation_tutorial(){
        // var anmt = this;
        const controller = this.scene.get('Controller');
        const scenemng = this.scene.get('SceneManager');

        controller.copy = scenemng.item_factory(controller.dragX, controller.dragY, controller.drag[controller.dragType].item).setAlpha(0);
        
        controller.copy.setAlpha(0.4);
        this.animation_true_pos(controller.copy, 5000);
        this.animation_fade_item(controller.copy, 'fade out', 3000);

        setTimeout(function(){controller.destroy(controller.copy);},6000);
        
    }

    animation_fade_screen(flag, duration){
        const anmt = this;
        const controller = this.scene.get('Controller');

        anmt.animation_fade_item(controller.drag_item, flag, duration);
        anmt.animation_fade_item(controller.drop[0], flag, duration);
        anmt.animation_fade_item(controller.drop[1], flag, duration);
        anmt.animation_fade_item(controller.sound, flag, duration);
        anmt.animation_fade_item(controller.obstacle_item, flag, duration);
        anmt.animation_fade_item(controller.sentence, flag, duration);
    }
}

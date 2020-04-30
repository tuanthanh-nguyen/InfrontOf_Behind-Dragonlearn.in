class Animation extends Phaser.Scene{
    constructor(){
        super("Animation");
    }
    test(){
        return 1;
    }


    animation_move(item, pos_x, pos_y, duration){
        var controller = this.scene.get('Controller');

        var timeline = controller.tweens.createTimeline();
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
        var controller = this.scene.get('Controller');

        var v1 = 0, v2 = 1;
        if(flag == 'fade out') {
            v1 = 1;
            v2 = 0;
        }
        var timeline = controller.tweens.createTimeline();
                timeline.add({
                    targets: item,
                    alpha: { start: v1, to: v2 },
                    ease: 'Linear',
                    duration: duration,
                });
                timeline.play();
    }


    animation_correct(item, offSet){
        var controller = this.scene.get('Controller');

        var tween = controller.tweens.add({
            targets: item,
            y: offSet - 50,
            ease: 'Power1',
            duration: 500,
            yoyo: true,
            repeat: 1
        });
    }


    animation_true_pos(item){
        var anmt = this;
        var controller = this.scene.get('Controller');

        var offSetX = controller.drop[controller.caseType].x + controller.drop[controller.caseType].width/2 
        var offSetY = controller.drop[controller.caseType].y + controller.drop[controller.caseType].width/2 

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
        setTimeout(function(){anmt.animation_correct(item, offSetY + controller.drag[controller.dragType].offSet[controller.caseType].Y)},3000);
    }

    animation_alert(){
        var anmt = this;
        var controller = this.scene.get('Controller');
        var scenemng = this.scene.get('SceneManager');

        controller.arrow = scenemng.item_factory(1050, 500, 'arrow');
        controller.arrow.angle = 90;
        anmt.animation_move(controller.arrow, 1050, 250, 3000);
        anmt.animation_fade_item(controller.arrow, 'fade out', 3000);

        setTimeout(function(){controller.destroy(controller.arrow);},4000);
    }


    animation_tutorial(){
        var anmt = this;
        var controller = this.scene.get('Controller');
        var scenemng = this.scene.get('SceneManager');

        controller.copy = scenemng.item_factory(controller.dragX, controller.dragY, controller.drag[controller.dragType].item).setAlpha(0);
        
        controller.copy.setAlpha(0.4);
        anmt.animation_true_pos(controller.copy, 5000);
        anmt.animation_fade_item(controller.copy, 'fade out', 3000);

        setTimeout(function(){controller.destroy(controller.copy);},6000);
        
    }

    animation_fade_screen(flag, duration){
        var anmt = this;
        var controller = this.scene.get('Controller');

        anmt.animation_fade_item(controller.drag_item, flag, duration);
        anmt.animation_fade_item(controller.drop[0], flag, duration);
        anmt.animation_fade_item(controller.drop[1], flag, duration);
        anmt.animation_fade_item(controller.sound, flag, duration);
        anmt.animation_fade_item(controller.obstacle_item, flag, duration);
        anmt.animation_fade_item(controller.sentence, flag, duration);
    }
}

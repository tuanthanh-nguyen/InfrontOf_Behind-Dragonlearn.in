class Animation extends Phaser.Scene{
    constructor(){
        super("Animation");
    }
    /**
     * move the object from one place to another place
     * @param {Phaser.Object} item - item to move
     * @param {number} pos_x    - x coordinate in canvas
     * @param {number} pos_y    - y coordinate in canvas
     * @param {time} duration   - interval from start to finish
     */
    animation_move(item, pos_x, pos_y, duration){
        controller.tweens.add({
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
        controller.tweens.add({
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
        controller.tweens.add({
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
        let offSetX = scnmng.get_drag_item().offSet[scnmng.get_case_index()].X;
        let offSetY = scnmng.get_drag_item().offSet[scnmng.get_case_index()].Y;
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
        controller.tweens.addCounter({
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
        this.animation_fade_item(scnmng.get_drag_item().sprite, flag, duration);
        for(let i = 0; i < controller.drop_item.length ; i++){
            this.animation_fade_item(controller.drop_item[i].sprite, flag, duration);
        }
        this.animation_fade_item(controller.sound, flag, duration);
        this.animation_fade_item(scnmng.get_obstacle_item().sprite, flag, duration);
        this.animation_fade_item(controller.sentence.text, flag, duration);
        this.animation_fade_item(controller.road, flag, duration);
    }
}

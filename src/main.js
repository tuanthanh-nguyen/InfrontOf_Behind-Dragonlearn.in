const config={
    type: Phaser.AUTO,
    backgroundColor: "#edf7f5",
    scale :{
        width: 1920,
        height: 1080,
    }, 
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [Controller, Animation, Handler, Speaker, SceneManager, UIScene]
}
var game = new Phaser.Game(config);
/**
 







 */


var controller, anmt, handler, speaker, scnmng, uiscene;
/*
    Since the phaser has kinda a mixture of JS ES6 and the game canvas only operate in one scope which acts as a class.
    In here, i choose the controller class as the inter-mediate class to run the game.
    As a result, other classes have to borrow the scope of each others in order to be fully functional.
*/
function init_scope(){
    if(controller === undefined) controller = this.game.scene.scenes[0];
    if(anmt === undefined) anmt = this.game.scene.scenes[1];
    handler = this.game.scene.scenes[2];
    if(speaker === undefined) speaker = this.game.scene.scenes[3];
    if(scnmng === undefined) scnmng = this.game.scene.scenes[4];
    if(uiscene === undefined) uiscene = this.game.scene.scenes[5];
}
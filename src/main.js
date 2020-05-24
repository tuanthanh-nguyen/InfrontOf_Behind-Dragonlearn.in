var config={
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

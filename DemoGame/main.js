var config={
    width: "100",
    height: "100",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [Controller, Animation, Handler, Speaker, SceneManager, UIScene]
}
var game = new Phaser.Game(config);

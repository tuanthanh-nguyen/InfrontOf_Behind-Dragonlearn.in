var config={
    width: "100",
    height: "100",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [Controller, SceneA, SceneB, SceneC, SceneD, UIScene ,End]
}
var game = new Phaser.Game(config);

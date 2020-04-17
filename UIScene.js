class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });
        this.score = 4;
    }
    preload(){
        this.load.image('process_ball','image/1.png');
    }
    create()
    {
        this.process_ball = [];
        for (let i = 0; i < 4; i++)
        {
            this.process_ball[i] = this.add.sprite(40 + i*40,40,'process_ball');
        }
        //  Our Text object to display the Score
        var info = this.add.text(10, 10, 'Score: 4');

        //  Grab a reference to the Game Scene
        var ourGame = this.scene.get('Controller');

        //  Listen for events from it
        ourGame.events.on('addScore', function () {

            console.log("update UI bar");
            this.score--;
            if(this.score < 0){
                //change to end state
            }

            info.setText('Score: ' + this.score);
            var timeline = this.tweens.createTimeline();
                    timeline.add({
                        targets: this.process_ball[this.score],
                        x: this.process_ball[this.score].x + 400,
                        y: 40,
                        ease: 'Power1',
                        duration: 1000
                    });
                    timeline.play();

        }, this);
    }
}
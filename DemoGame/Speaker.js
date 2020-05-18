class Speaker extends Phaser.Scene{
    constructor(){
        super("Speaker");
    }


    say(item,m) {
        const ref = this.scene.get('Controller');
        
        item.on('pointerdown', function (pointer) {
            const msg = new SpeechSynthesisUtterance();
            var voices = window.speechSynthesis.getVoices();
            msg.voice = voices[ref.get_random_int(0,10)];
            msg.voiceURI = "native";
            msg.volume = 1;
            msg.rate = 1;
            msg.pitch = 0.8;
            msg.text = m;
            msg.lang = 'en-US';
            speechSynthesis.speak(msg); 
        })
    }
}
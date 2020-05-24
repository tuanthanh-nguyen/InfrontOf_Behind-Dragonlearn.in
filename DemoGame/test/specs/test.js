
// describe('Phaser', function () {
  
//     it('is version 3.22.0', function () {
//       expect(Phaser.VERSION).toBe('3.22.0');
//     });
//   });


var scene;
var game;
var item;

describe('DragonLearn.in Unit Testing', function() {
  
  beforeAll(function() {
    game = new Phaser.Game({
      type: Phaser.HEADLESS,
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
      scene: {}
    });
  })
  

  
  describe('Canvas testing', function() {
    it('check if game-screen resolution is 1920x1080', function() {
      expect(game.canvas.width).toBe(1920);
      expect(game.canvas.height).toBe(1080);
    })
    it('initialize scene', function() {
      scene = game.scene.scenes[0];
      expect(scene).not.toBe(null);
    })
  })

  describe('Item testing', function() {
    beforeEach(function() {
      scene = game.scene.scenes[0];
      scene.load.svg('ball', '../image/35.svg',{width:"150", height:"150"});
      item = scene.physics.add.sprite(200, 200, 'ball').setInteractive({ pixelPerfect: true}).setOrigin(0,0);
    })
    afterEach(function() {
      item.destroy(true);
      item = null;
    })
    it('check if item is created', function() {
      expect(item).not.toBe(null);
    })
    it('check if item is at (200, 200)', function() {
      expect(item.x).toBe(200);
      expect(item.y).toBe(200);
    })
    it('check if item is draggable', function() {
      scene.input.setDraggable(item);
      expect(item.input.draggable).toBe(true);
    })
    it('check if item is droppable', function() {
      item.input.dropZone = true;
      expect(item.input.dropZone).toBe(true);
    })
  })

  describe('Animation testing', function() {
    beforeEach(function() {
      scene = game.scene.scenes[0];
      scene.load.svg('ball', '../image/35.svg',{width:"150", height:"150"});
      item = scene.physics.add.sprite(200, 200, 'ball').setInteractive({ pixelPerfect: true}).setOrigin(0,0);
    })
    afterEach(function() {
      item.destroy(true);
      item = null;
    })
    it('check if item is moved from (200, 200) to (400, 300)', function(done) {
      var timeline = scene.tweens.createTimeline();
        timeline.add({
            targets: item,
            x: 400,
            y: 300,
            ease: 'Power1',
            duration: 0,
        });
      timeline.play();
      setTimeout(function(){
        expect(item.x).toBe(400);
        expect(item.y).toBe(300);
        done();
      }, 1000);
    })
    it('check if item fading-alpha is 0', function(done) {
      var timeline = scene.tweens.createTimeline();
        timeline.add({
            targets: item,
            alpha: { start: 1, to: 0 },
            ease: 'Linear',
            duration: 0,
        });
      timeline.play();
      setTimeout(function(){
        expect(item.alpha).toBe(0);
        done();
      }, 1000);
    })
  })

  describe('Interaction testing', function() {
    beforeEach(function() {
      scene = game.scene.scenes[0];
      scene.load.svg('ball', '../image/35.svg',{width:"150", height:"150"});
      item = scene.physics.add.sprite(200, 200, 'ball').setInteractive({ pixelPerfect: true}).setOrigin(0,0);
    })
    afterEach(function() {
      item.destroy(true);
      item = null;
    })
    it('check if item is clicked ', (done) => {
      let spy = jasmine.createSpy();
      item.once('pointerdown', spy)
      item.emit('pointerdown');
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      }, 0);
    })
    it('check if item is being dragged ', (done) => {
      let spy = jasmine.createSpy();
      item.on('drag', spy)
      item.emit('drag');
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      }, 0);
    })
    it('check if item is being dropped ', (done) => {
      let spy = jasmine.createSpy();
      item.on('dragend', spy)
      item.emit('dragend');
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      }, 0);
    })
    it('check if item is being dropped into another item', (done) => {
      let spy = jasmine.createSpy();
      var dropz = scene.physics.add.sprite(200, 200, 'ball');
      scene.input.on('drop', function() {
        scene.physics.add.overlap(item, dropz, spy);
      })
      scene.input.emit('drop');
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      }, 100);
    })
  })
})
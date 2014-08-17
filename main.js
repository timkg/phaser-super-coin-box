var mainState = {
  preload: function () {

  },
  create: function () {
    game.stage.backgroundColor = '#3498db';
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  update: function () {

  }
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameContainer');
game.state.add('main', mainState);
game.state.start('main');

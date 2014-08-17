var mainState = {
  preload: function () {
    game.load.image('player', 'assets/player.png');
  },

  create: function () {
    game.stage.backgroundColor = '#3498db';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(.5, .5);

    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 500;

    this.cursor = game.input.keyboard.createCursorKeys();

  },

  update: function () {
    this.movePlayer();
  },

  movePlayer: function () {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
    } else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
    } else {
      this.player.body.velocity.x = 0;
    }

    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -320;
    }


  }
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameContainer');
game.state.add('main', mainState);
game.state.start('main');

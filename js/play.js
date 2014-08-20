var playState = {
  create: function () {
    this.cursor = game.input.keyboard.createCursorKeys();

    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(.5, .5);
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 500;
    this.player.animations.add('right', [1, 2], 8, true);
    this.player.animations.add('left', [3, 4], 8, true);

    this.createWorld();
    this.createEnemies();

    this.coin = game.add.sprite(60, 140, 'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(.5,.5);

    this.scoreLabel = game.add.text(30, 30, 'score: 0', {
      font: '18ox Arial', fill: '#ffffff'});
    game.global.score = 0;

    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.deadSound = game.add.audio('dead');
  },

  createWorld: function () {
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollision(1); // set which tile reacts to collisions - 1-indexed, not 0-indexed?
  },

  createEnemies: function () {
    this.enemies = game.add.group();
    this.enemies.enableBody = true;

    this.enemies.createMultiple(10, 'enemy'); // creates 10 'enemy' sprites in a 'dead' state
    game.time.events.loop(2200, this.addEnemy, this); // add enemy every 2.2 seconds
  },

  addEnemy: function () {
    var enemy = this.enemies.getFirstDead(); // get the first dead enemy from the group

    if (!enemy) {
      return;
    }

    enemy.anchor.setTo(.5, 1);
    enemy.reset(game.world.centerX, 0);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;

  },

  update: function () {
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);
    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.killPlayer, null, this);

    this.movePlayer();
    if (!this.player.inWorld) {
      this.killPlayer();
    }
  },

  movePlayer: function () {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    } else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();
      this.player.frame = 0;

    }

    if (this.cursor.up.isDown && this.player.body.onFloor()) {
      this.player.body.velocity.y = -320;
      this.jumpSound.play();
    }
  },

  takeCoin: function () {
    this.coin.scale.setTo(0, 0);
    this.coin.kill();
    game.global.score += 5;
    this.scoreLabel.text = 'score: ' + game.global.score;
    this.updateCoinPosition();
    this.coinSound.play();
    game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
    game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150) .start();
  },

  updateCoinPosition: function() {
    var coinPosition = [
      {x: 140, y: 60}, {x: 360, y: 60}, // Top row
      {x: 60, y: 140}, {x: 440, y: 140}, // Middle row
      {x: 130, y: 300}, {x: 370, y: 300} // Bottom row
    ];

    // Remove the current coin position from the array for the remaining of this function
    // The positions are set again at the start of the method, this only guarantees picking a new position
    for (var i = 0; i < coinPosition.length; i++) {
      if (coinPosition[i].x === this.coin.x) {
        coinPosition.splice(i, 1);
      }
    }

    var newPosition = coinPosition[ game.rnd.integerInRange(0, coinPosition.length-1)];
    this.coin.reset(newPosition.x, newPosition.y);
  },

  killPlayer: function () {
    game.state.start('menu');
    this.deadSound.play();
  }
};

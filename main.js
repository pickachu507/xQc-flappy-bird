// Create our 'main' state that will contain the game
var isPressed = false;
var mainState = {
    preload: function() { 
        game.load.image('bird', 'assets/xqcE.png');
		game.load.image('pipe', 'assets/kephrii.png');
		game.load.audio('small', 'assets/small.wav');
		game.load.audio('big', 'assets/big.wav');
		game.load.audio('big_small', 'assets/big_small.wav');
		game.load.audio('agane', 'assets/agane.wav');
		game.load.image('background', 'assets/winston.png');
    },

    create: function() { 
			game.add.tileSprite(0, 0, 1000, 600, 'background');
			
			// Create an empty group
			this.pipes = game.add.group(); 
			
			// Set the physics system
			game.physics.startSystem(Phaser.Physics.ARCADE);

			// Display the bird at the position x=100 and y=245
			this.bird = game.add.sprite(100, 245, 'bird');

			// Add physics to the bird
			// Needed for: movements, gravity, collisions, etc.
			game.physics.arcade.enable(this.bird);

			// Add gravity to the bird to make it fall
			this.bird.body.gravity.y = 1000;  

			// Call the 'jump' function when the spacekey is hit
			var spaceKey = game.input.keyboard.addKey(
							Phaser.Keyboard.SPACEBAR);
			spaceKey.onDown.add(this.jump, this);  

			this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 
			
			this.score = 0;
			this.labelScore = game.add.text(20, 20, "0", 
				{ font: "30px Arial", fill: "#ffffff" });   
			
			this.bird.anchor.setTo(-0.2, 0.5);
			this.jumpSound_small = game.add.audio('small');
			this.jumpSound_big = game.add.audio('big');	
			this.jumpSound_big_small = game.add.audio('big_small');
			this.go_agane = game.add.audio('agane');
		
		},

		update: function() {
			// If the bird is out of the screen (too high or too low)
			// Call the 'restartGame' function
			if (this.bird.y < 0 || this.bird.y > 490)
				this.restartGame(); 
			game.physics.arcade.overlap(
			this.bird, this.pipes, this.hitPipe, null, this);  
			if (this.bird.angle < 20)
			this.bird.angle += 1; 
			},
			
		jump: function() {
			isPressed = true;
			if (this.bird.alive == false)
			return;  
			// Add a vertical velocity to the bird
			this.bird.body.velocity.y = -350;
			// Create an animation on the bird
			var animation = game.add.tween(this.bird);

			// Change the angle of the bird to -20° in 100 milliseconds
			animation.to({angle: -20}, 100);

			// And start the animation
			animation.start(); 
			var random_sound = Math.floor(Math.random() * 10);
			if(random_sound < 6) 
			{
				this.jumpSound_small.play();
			}
			else
			{
				if(random_sound == 8 || random_sound == 7)
				{
					this.jumpSound_big_small.play();
				}
				else
				{
					this.jumpSound_big.play();
				}
			}
		},

		// Restart the game
		restartGame: function() {
				// Start the 'main' state, which restarts the game
				
				game.state.start('main');
				if(isPressed)
				{
					this.go_agane.play();
				}
		},
		
		addOnePipe: function(x, y) {
			// Create a pipe at the position x and y
			var pipe = game.add.sprite(x, y, 'pipe');

			// Add the pipe to our previously created group
			this.pipes.add(pipe);

			// Enable physics on the pipe 
			game.physics.arcade.enable(pipe);

			// Add velocity to the pipe to make it move left
			pipe.body.velocity.x = -200; 

			// Automatically kill the pipe when it's no longer visible 
			pipe.checkWorldBounds = true;
			pipe.outOfBoundsKill = true;
		},
		
		addRowOfPipes: function() {
			// Randomly pick a number between 1 and 5
			// This will be the hole position
			var hole = Math.floor(Math.random() * 5) + 1;

			// Add the 6 pipes 
			// With one big hole at position 'hole' and 'hole + 1'
			for (var i = 0; i < 8; i++)
				if (i != hole && i != hole + 1) 
					this.addOnePipe(400, i * 60 + 10);   
			this.score += 1;
			this.labelScore.text = this.score;  
		},
		
		hitPipe: function() {
			// If the bird has already hit a pipe, do nothing
			// It means the bird is already falling off the screen
			if (this.bird.alive == false)
				return;

			// Set the alive property of the bird to false
			this.bird.alive = false;

			// Prevent new pipes from appearing
			game.time.events.remove(this.timer);

			// Go through all the pipes, and stop their movement
			this.pipes.forEach(function(p){
				p.body.velocity.x = 0;
			}, this);
		}, 
		
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');

if(typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
   var resumeAudio = function() {
      if(typeof g_WebAudioContext == "undefined" || g_WebAudioContext == null) return;
      if(g_WebAudioContext.state == "suspended") g_WebAudioContext.resume();
      document.removeEventListener("click", resumeAudio);
   };
   document.addEventListener("click", resumeAudio);
}

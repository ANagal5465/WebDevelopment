window.onload = function () {

	var game = new Phaser.Game(320, 500, Phaser.CANVAS);
	//Bird variables 
	var bird;
	var birdWeight = 800;
	var birdVelocity = 125;
	var birdFlapPower = 300;

	//Lives Variables player has 3 total lives
	var lives = 0;
	var livesObj;
	var bonusLifeOnLevel = 0;

	//Pipes Variables
	var pipeGroup;
	var pipeInterval = 1750;//time(ms) between pipes
	var pipeHole = 125;
	var holePosition;

	//Score Variables
	var score = 0;
	var scoreText;
	var topScore;

	//Speed Power Up Variables
	var speedObj;
	var speedBoostOnLevel = 0;
	var gameSpeed = 1;

	//ExtraPointToken Variables
	var pointObj;
	var pointBoostOnLevel = 0;

	//PowerUpSpawn
	var powerUpSpawn;
	var powerUpSpawnInterval = 7000;

	var play = function (game) { }

	//Function for the newPipe at super high scores
	var runOnce = false;
	

	play.prototype = {
		preload: function () {
			game.load.image("bird", "assets/coke.png");
			game.load.image("pipe", "assets/pepsiPipe.png");
			game.load.image("life", "assets/cokeCanLife.png")
			game.load.image("speed", "assets/cokeSpeed.png")
			game.load.image("point", "assets/goldenCoke.png")
		},

		create: function () {
			//creating variables
			pipeGroup = game.add.group();
			score = 0;
			
			lives = 3;
			//lives = 10;
			//lives = 9999;

			//code for score/topscore/lives
			topScore = localStorage.getItem("top") == null ? 0 : localStorage.getItem("top");
			scoreText = game.add.text(10, 10, "-", {
				font: "bold 16px Arial"
			});
			liveText = game.add.text(10, 60, "-", {
				font: "bold 16px Arial"
			})
			liveText.text = "Lives: " + lives;
			updateScore();
			
			//Game Creation Code
			game.time.desiredFps = 60;
			game.time.slowMotion = 1;
			game.stage.backgroundColor = "#87CEEB";
			game.stage.disableVisibilityChange = true;
			game.physics.startSystem(Phaser.Physics.ARCADE);
			bird = game.add.sprite(80, 240, "bird");
			bird.anchor.set(0.5);;
			game.physics.arcade.enable(bird);
			bird.body.gravity.y = birdWeight;
			game.input.onDown.add(flap, this);
			game.time.events.loop(pipeInterval, addPipe);
			game.time.events.loop(powerUpSpawnInterval, spawnPowerUp);
			addPipe();
		},
		update: function () {
			//Checks for collision with a pipe
			game.physics.arcade.collide(bird, pipeGroup, die);
			//This checks for when there is a bonus life active on the map 
			//and then checks for a collision to add a life to the player's pool
			if (bonusLifeOnLevel == 1) {
				game.physics.arcade.overlap(bird, livesObj, addLives);
			}

			if (speedBoostOnLevel == 1) {
				//DEVCODE
				game.physics.arcade.overlap(bird, speedObj, increaseSpeed);
			}
			if (pointBoostOnLevel == 1) {
				game.physics.arcade.overlap(bird, pointObj, freePoint);
			}

			//Adds a new pipe once a player gets to high score areas  
			if(score == 50 && runOnce == false || score == 75 && runOnce == false || score == 100 && runOnce == false || score == 125 && runOnce == false){
				//game.time.events.add(750, function () { addPipe() });
				addPipe();
				runOnce = true;
			}

			//This checks the lower bounds bounds, the player may go above the upper bounds
			if (bird.y > game.height) {
				resetBird();
				die();
			}
		}
	}

	game.state.add("Play", play);
	game.state.start("Play");


	//This function updates the lives text
	function updateLives() {
		liveText.text = "Lives: " + lives;
	}

	//This function updates the score text and also checks when to allow powerups to spawn
	function updateScore() {
		scoreText.text = "Score: " + score + "\nBest: " + topScore;
	}

	//This function spawns the powerups on a semi rotating basis, points spawn somewhat randomly and lives + speed 
	function spawnPowerUp() {
		if (whichPowerUp() == 3) {
			additionalPointPowerUp();
			powerUpSpawn = 1;
		}
		if (whichPowerUp() == 2 && whichPowerUp() != 1 && whichPowerUp() != 3) {
			extraLives();
			powerUpSpawn = 3;
		}
		if (whichPowerUp() == 1 && whichPowerUp() != 2 && whichPowerUp() != 3) {
			speedPowerUp();
			powerUpSpawn = 2;
		}
	}
	//This function checks which powerup is next
	function whichPowerUp() {
		if (powerUpSpawn == undefined) {
			powerUpSpawn = 1;
		}
		return powerUpSpawn;
	}

	//This function controls the bird's movement
	function flap() {
		bird.body.velocity.y = -birdFlapPower;
	}

	//This method controls the pipes
	function addPipe() {
		var pipeHolePosition = game.rnd.between(75, 430 - pipeHole);
		var upperPipe = new Pipe(game, 320, pipeHolePosition - 480, -birdVelocity);

		//This has a 500ms timer because the variable holePosition is used to calculate where to respawn the player,
		//without this variable the player could sometimes instantly die because they would spawn at the next pipes gap
		//while still inside the hole they're still going through
		game.time.events.add(500, function () { holePosition = pipeHolePosition; });
		game.add.existing(upperPipe);
		pipeGroup.add(upperPipe);
		var lowerPipe = new Pipe(game, 320, pipeHolePosition + pipeHole, -birdVelocity);
		pipeGroup.add(lowerPipe);
	}

	//pipe object code
	Pipe = function (game, x, y, speed) {
		Phaser.Sprite.call(this, game, x, y, "pipe");
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.velocity.x = speed;
		this.giveScore = true;
		this.body.immovable = true;
	};
	Pipe.prototype = Object.create(Phaser.Sprite.prototype);
	Pipe.prototype.constructor = Pipe;
	//code gives the player score
	Pipe.prototype.update = function () {
		if (this.x + this.width < bird.x && this.giveScore) {
			score += .5;
			updateScore();
			this.giveScore = false;
		}
		if (this.x < -this.width) {
			this.destroy();
		}
	};

	//CONTROLS THE
	//LIFE AND 
	//DEATH FUNCTIONS

	//This function controls the extra life tokens that spawn every 5 points//pipes
	function extraLives() {
		if (bonusLifeOnLevel == 0) {
			rndPosition = game.rnd.integerInRange(30, 420);
			livesObj = game.add.sprite(80, game.rnd.between(75, rndPosition), "life");
			game.physics.arcade.enable(livesObj);
			bonusLifeOnLevel = 1;
		}
	}

	//This function adds the life when the collision occurs
	function addLives() {
		lives = lives + 1;
		updateLives();
		livesObj.kill();
		destroyLifeObject();
		game.time.events.add(1500, function () { bonusLifeOnLevel = 0; });
	}

	//This function controls when the user hits a pipe or leaves the bounds, 
	//it decreases the life counter by 1, if the life counter is at 1 and you get hit you lose// ie. you get 3 lives total 
	function die() {
		if (lives == 1) {
			localStorage.setItem("top", Math.max(score, topScore));
			game.state.start("Play");
			resetVariables();
		}
		else {
			lives = lives - 1;
			updateLives();
			resetBird();
		}
	}

	//This function resets the bird at the same x axis value and sets the y equal to the pipe that can give the player score
	function resetBird() {
		bird.destroy()
		bird = game.add.sprite(80, holePosition + 50, "bird");
		game.physics.arcade.enable(bird);
		bird.body.gravity.y = birdWeight;
		game.input.onDown.add(flap, this);
	}

	//POWERUPS
	//BELOW

	//This function is going to control the speed power up that will spawn
	function speedPowerUp() {
		if (speedBoostOnLevel == 0) {
			rndPosition = game.rnd.integerInRange(30, 420);
			speedObj = game.add.sprite(80, game.rnd.between(75, rndPosition), "speed");
			game.physics.arcade.enable(speedObj);
			speedBoostOnLevel = 1;
			speedRan = true;
		}
	}

	//These two functions destroy the objects, this was used to olve a bug regarding multple icons displaying but not killing
	function destroySpeedObj() {
		speedObj.destroy();
		speedRan = false;
		speedBoostOnLevel = 0;
	}
	function destroyLifeObject() {
		livesObj.destroy();
	}

	//This function increases the speed
	function increaseSpeed() {
		if (gameSpeed > .7) {
			gameSpeed = gameSpeed - .1;
		} if (gameSpeed < .7 && gameSpeed > .4) {
			gameSpeed = gameSpeed - .075;
		}
		if (gameSpeed < .4 && gameSpeed > .026) {
			gameSpeed = gameSpeed - .025;
		}
		if (gameSpeed > .026) {
			game.time.slowMotion = gameSpeed;
		}				
		speedObj.kill();
		destroySpeedObj();
	}

	//Extra Point function
	function additionalPointPowerUp() {
		if (pointBoostOnLevel == 0) {
			if(score < 45 || score > 55 || score < 70 || score > 80 || score < 95 || score > 105 || score < 120 || score < 130){
				rndPosition = game.rnd.integerInRange(30, 420);
				pointObj = game.add.sprite(80, game.rnd.between(75, rndPosition), "point");
				game.physics.arcade.enable(pointObj);
				pointBoostOnLevel = 1;
			}
		}
	}

	//Function gives the player a free point and destroys the pointObj.
	function freePoint() {
		score = score + 1;
		updateScore();
		pointBoostOnLevel = 0;
		pointObj.kill();
	}

	//This function bulkresets all of the game variables that need to be reset on final death
	function resetVariables() {
		powerUpBank = 0
		bonusLifeOnLevel = 0;
		scoreCounterForExtraPipe = 0;
		extraPipe = 1;
		score = 0;
		gameSpeed = 1;
		speedBoostOnLevel = 0;
		pointBoostOnLevel = 0;
	}
}

class Playground {
  constructor(mainDiv, width, height) {
    this.mainDiv = mainDiv;
    this.width = width;
    this.height = height;
    this.score = 0;
    this.highscore = 0;
    this.gap = 150;
    this.pipes = [];
    this.timeSpanToGeneratePipe = 0;
    this.interval;
    this.gameOver = false;
    this.gameOverScreen = null;
    this.paused = false;
    this.sound;
    this.dieSound;
    this.pointSound;
    this.hitSound;
    this.pausePlay = this.pausePlay.bind(this);
  }

  init = () => {
    this.createStartScreen();
    this.bird = this.createBird();
    this.updateHighScore();
    this.pointSound = new Sound(this.mainDiv, "./audio/sfx_point.wav");
    this.pointSound.init();
    this.hitSound = new Sound(this.mainDiv, "./audio/sfx_hit.wav");
    this.hitSound.init();
    this.background = new Sound(this.mainDiv, "./audio/background_.mp3");
    this.background.init();
    document.querySelector(".btn-start").onclick = this.start.bind(this);
    let pauseBtn = document.querySelector(".btn-pause");
    pauseBtn.onclick = this.pausePlay;
  };

  createStartScreen = () => {
    //create interaction element and add button element into it
    let interaction = document.createElement("div");
    interaction.classList.add("interaction");
    let btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");
    let btnStart = document.createElement("a");
    btnStart.classList.add("btn");
    btnStart.classList.add("btn-start");
    btnStart.innerHTML = "Start";
    let btnPause = document.createElement("a");
    btnPause.classList.add("btn");
    btnPause.classList.add("btn-pause");
    btnPause.innerHTML = "Pause";
    btnGroup.appendChild(btnStart);
    btnGroup.appendChild(btnPause);
    btnPause.style.display = "none";

    let score = document.createElement("div");
    score.classList.add("score");
    score.innerHTML = "Score: ";
    let scoreNum = document.createElement("span");
    scoreNum.classList.add("score_number");
    scoreNum.innerHTML = 0;
    score.appendChild(scoreNum);

    interaction.appendChild(btnGroup);
    interaction.appendChild(score);

    //Playground screen creation
    let startScreen = document.createElement("div");
    startScreen.classList.add("playground");
    this.mainDiv = startScreen;

    let helpText = document.createElement("div");
    helpText.classList.add("help-text");
    helpText.innerHTML = `NOTE: Press Start button to start the game and Press "Space" Key to jump.`;
    helpText.style.width = this.width + "px";

    let body = document.querySelector(".main-body");
    body.appendChild(interaction);
    body.appendChild(startScreen);
    body.appendChild(helpText);
  };

  createBird = () => {
    let bird = new Bird(this.mainDiv, this.width, this.height);
    bird.init();
    bird.draw();
    return bird;
  };

  createPipe = () => {
    let topHeight = Math.random() * 200 + 100;
    let pipes = new Pipe(this.mainDiv, this.width, 0, topHeight);
    pipes.init();
    pipes.element.style.transform = "rotate(180deg)";
    this.pipes.push(pipes);

    let bottomPosition = topHeight + this.gap;
    let bottomHeight = this.height - this.gap;
    let bottomPipe = new Pipe(
      this.mainDiv,
      this.width,
      bottomPosition,
      bottomHeight
    );
    bottomPipe.init();
    this.pipes.push(bottomPipe);
  };

  movePipe = () => {
    this.pipes.forEach((pe, i) => {
      pe.move(1);
      let birdposition = this.bird.x + this.bird.width;

      //score increase if pipe position with with is less than bird position and also if pipe passed values is false and i modular value is set to true;
      if (pe.x + pe.width < birdposition && !pe.passed && i % 2) {
        this.score++;
        this.pointSound.play();
        pe.passed = true;
        document.querySelector(".score_number").innerHTML = this.score;
        if (this.score > this.highscore) {
          this.highscore = this.score;
          localStorage.setItem(`highscore`, this.score);
        }
      }
    });
  };

  start = () => {
    document.querySelector(".btn-pause").style.display = "block";
    document.querySelector(".btn-start").style.display = "none";

    if (this.gameOver) {
      if (this.gameOverScreen) {
        this.resetGame();
      }
    }
    this.interval = setInterval(() => {
      if (!(this.timeSpanToGeneratePipe % 160)) {
        this.createPipe();
        this.timeSpanToGeneratePipe = 1;
      }
      this.background.play();
      this.dropBird();
      this.add();
      if (this.gameOver) {
        if (this.score > this.highscore) {
          this.highscore = this.score;
        }
        //bird fall when game is over
        this.dropInterval = setInterval(() => {
          this.bird.element.style.transform = "rotate(180deg)";
          this.dropBird();
          //if game over then clear interval of pipe generation.
          clearInterval(this.interval);
        });
      }
      this.timeSpanToGeneratePipe++;
    }, 20);
  };

  add = () => {
    this.movePipe();
    let checkCollision = this.checkCollision(this.pipes, this.bird);
    if (checkCollision) {
      this.gameOver = true; //if checkCollision is true then gameOver variable is set to true;
      this.hitSound.play();
      this.background.pause();
      document.querySelector(".btn-pause").style.display = "none";
      document.querySelector(".btn-start").style.display = "block";
      document.querySelector(".btn-start").classList.add("btn-disabled");
      this.createGameOverScreen();
    }
  };

  dropBird = () => {
    this.bird.jump();
    this.bird.draw();
  };

  checkCollision = (pipes, bird) => {
    let left = bird.x;
    let right = bird.x + bird.width;
    let top = bird.y;
    let bottom = bird.y + bird.height;

    for (var i = 0; i < pipes.length; i++) {
      if (bottom >= this.height || bottom < 0) {
        return true;
      }
      if (
        left < pipes[i].x + pipes[i].width &&
        right > pipes[i].x &&
        top < pipes[i].y + pipes[i].height &&
        bottom > pipes[i].y
      ) {
        return true;
      }
    }
    return false;
  };

  createGameOverScreen = () => {
    let parentScreen = document.createElement("div");
    let text = document.createElement("div");
    let highscoreElem = document.createElement("div");
    let currentScore = document.createElement("div");
    let reset = document.createElement("a");

    parentScreen.classList.add("game-over");
    text.classList.add("game-over__text");
    currentScore.classList.add("game-over__score");
    highscoreElem.classList.add("game-over__score");
    reset.classList.add("btn");
    reset.setAttribute("id", "btn-reset");
    reset.innerHTML = "Reset";
    text.innerHTML = "GAME OVER!!";
    highscoreElem.innerHTML = "HighScore: " + this.highscore;
    currentScore.innerHTML = "Score: " + this.score;
    parentScreen.appendChild(text);
    parentScreen.appendChild(currentScore);
    parentScreen.appendChild(highscoreElem);
    parentScreen.appendChild(reset);
    this.gameOverScreen = parentScreen;
    this.mainDiv.appendChild(parentScreen);

    let resetBtn = document.getElementById("btn-reset");
    resetBtn.onclick = this.resetGame.bind(this); // reset game
  };

  resetGame = () => {
    this.score = 0;
    this.gameOver = false;
    this.mainDiv.removeChild(this.gameOverScreen);
    this.pipes.forEach((pipe) => {
      pipe.element.remove();
    });
    document.querySelector(".score_number").innerHTML = 0;
    this.pipes = [];
    this.bird.reset();
    clearInterval(this.dropInterval);
    this.dropBird();
    document.querySelector(".btn-start").classList.remove("btn-disabled");
  };

  updateHighScore = () => {
    const currHighScore = this.getHighScore();

    if (currHighScore == null) {
      this.highscore = 0;
    } else {
      this.highscore = localStorage.getItem(`highscore`);
    }
  };

  getHighScore = () => {
    return parseInt(localStorage.getItem(`highscore`));
  };

  pausePlay = () => {
    if (this.paused) {
      document.querySelector(".btn-pause").innerHTML = "Pause";
      this.paused = false;
      this.start();
      this.background.play();
    } else {
      document.querySelector(".btn-pause").innerHTML = "Play";
      this.paused = true;
      this.background.pause();
      clearInterval(this.interval);
    }
  };
}

(function () {
  let playground = document.querySelector(".playground");
  new Playground(playground, 500, 600).init();
})();

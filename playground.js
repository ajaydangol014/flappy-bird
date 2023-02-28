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
  }

  init = () => {
    this.bird = this.createBird();
    this.start();
    this.updateHighScore();
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
    this.interval = setInterval(() => {
      if (!(this.timeSpanToGeneratePipe % 160)) {
        this.createPipe();
        this.timeSpanToGeneratePipe = 1;
      }
      this.dropBird();
      this.add();
      if (this.gameOver) {
        if (this.score > this.highscore) {
          this.highscore = this.score;
          console.log(this.score, this.highscore);
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
    console.log(this.highscore);
    let parentScreen = document.createElement("div");
    let text = document.createElement("div");
    let highscoreElem = document.createElement("div");
    let currentScore = document.createElement("div");
    let resetBtn = document.querySelector(".reset");
    let newGameBtn = document.querySelector(".new-game");
    parentScreen.classList.add("game-over");
    text.classList.add("game-over__text");
    currentScore.classList.add("game-over__score");
    highscoreElem.classList.add("game-over__score");
    text.innerHTML = "GAME OVER!!";
    highscoreElem.innerHTML = "HighScore: " + this.highscore;
    currentScore.innerHTML = "Score: " + this.score;
    parentScreen.appendChild(text);
    parentScreen.appendChild(currentScore);
    parentScreen.appendChild(highscoreElem);
    resetBtn.onclick = this.resetGame.bind(this); // reset game
    newGameBtn.onclick = this.newGame.bind(this); // new game
    this.gameOverScreen = parentScreen;
    this.mainDiv.appendChild(parentScreen);
  };

  resetGame = () => {
    this.score = 0;
    this.gameOver = false;
    this.mainDiv.removeChild(this.gameOverScreen);
    this.pipes.forEach((pipe) => {
      pipe.element.remove();
    });
    this.pipes = [];
    this.bird.reset();
    clearInterval(this.dropInterval);
    this.start();
  };

  newGame = () => {
    this.resetGame();
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
}

(function () {
  let playground = document.querySelector(".playground");
  new Playground(playground, 500, 600).init();
})();

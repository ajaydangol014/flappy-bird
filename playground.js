class Playground {
  constructor(mainDiv, width, height) {
    this.mainDiv = mainDiv;
    this.width = width;
    this.height = height;
    this.score = 0;
    this.gap = 400;
    this.pipes = [];
    this.timeSpanToGeneratePipe = 0;
  }

  init = () => {
    this.bird = this.createBird();
    this.start();
    this.dropBird();
  };

  createBird = () => {
    let bird = new Bird(this.mainDiv, this.width, this.height);
    bird.init();
    bird.draw();
    return bird;
  };

  createPipe = () => {
    let pipeTopHeight = -(Math.random() * 80);
    let pipes = new Pipe(this.mainDiv, this.width, pipeTopHeight);
    pipes.init();
    this.pipes.push(pipes);

    let top = 600;
    let topHt = pipeTopHeight + this.gap;
    let topPipe = new Pipe(this.mainDiv, top, topHt);
    topPipe.init();
    topPipe.element.style.transform = "rotate(180deg)";
    this.pipes.push(topPipe);
  };

  movePipe = () => {
    this.pipes.forEach((pe, i) => {
      pe.move(1);
    });
  };

  start = () => {
    this.interval = setInterval(() => {
      if (!(this.timeSpanToGeneratePipe % 160)) {
        this.createPipe();
        this.timeSpanToGeneratePipe = 1;
      }

      this.add();
      this.timeSpanToGeneratePipe++;
    }, 20);
  };

  add = () => {
    this.movePipe();
    this.bird.jump();
  };

  dropBird = () => {
    let fall = setInterval(() => {
      this.bird.jump();
      this.bird.draw();
    }, 10);
  };
}

(function () {
  let playground = document.querySelector(".playground");
  new Playground(playground, 500, 600).init();
})();

class Pipe {
  constructor(mainElement, x, y) {
    this.element = null;
    this.mainElement = mainElement;
    this.x = x;
    this.y = y;
    // this.timerID;
  }

  init = () => {
    this.element = this.createPipe();
    this.draw();
    return this;
  };

  createPipe = () => {
    let pipe = document.createElement("div");
    pipe.classList.add("pipe");
    this.mainElement.appendChild(pipe);
    pipe.style.left = this.x + "px";
    pipe.style.bottom = this.y + "px";
    pipe.style.background = 'url("./pipe.png") no-repeat';
    return pipe;
  };

  move = (speedx) => {
    this.x -= speedx;
    this.draw();
  };

  draw = () => {
    this.element.style.left = this.x + "px";
    this.element.style.bottom = this.y + "px";
  };
}

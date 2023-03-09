class Bird {
  constructor(mainElement, x, y) {
    this.element = null;
    this.width = 34;
    this.height = 24;
    this.x = x / 2 - this.width / 2;
    this.y = y / 2;
    this.gravity = 3;
    this.mainElement = mainElement;
    this.playground = 600;
    this.pushUp = 40;
    this.resetWidth = x;
    this.resetHeight = y;
  }

  init = () => {
    let bird = document.createElement("div");
    bird.style.height = this.height + "px;";
    bird.style.width = this.width + "px";
    bird.classList.add("bird");
    this.element = bird;
    this.mainElement.appendChild(this.element);
    //add jump event listenter on space key press
    document.addEventListener("keydown", this.btnHandle.bind(this));
  };

  jump = () => {
    if (this.y + this.height < this.playground) {
      this.y += this.gravity;
    }
  };

  btnHandle = (e) => {
    if (e.code === "Space") {
      if (this.y + this.height === this.playground) {
        return;
      } else {
        this.y = this.y - this.pushUp;
      }
    }
  };

  draw = () => {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  };
  reset = () => {
    this.x = this.resetWidth / 2;
    this.y = this.resetHeight / 2;
    this.element.style.transform = "none";
  };
}

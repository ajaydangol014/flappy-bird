class Bird {
  constructor(mainElement, x, y) {
    this.element = null;
    this.width = 34;
    this.height = 24;
    this.x = x / 2 - this.width / 2;
    this.y = y / 2;
    this.gravity = 2;
    this.mainElement = mainElement;
    this.jump = this.jump.bind(this);
  }

  init = () => {
    let bird = document.createElement("div");
    bird.style.height = this.height + "px;";
    bird.style.width = this.width + "px";
    bird.classList.add("bird");
    this.element = bird;
    this.mainElement.appendChild(this.element);
    //add jump event listenter on space key press
    document.addEventListener("keydown", this.jump);
  };

  jump = (e) => {
    if (e.code === "Space") {
      this.y = -this.gravity;
      this.style.bottom = this.y + "px";
    }
  };

  draw = () => {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  };
}

class Sound {
  constructor(mainElement, src) {
    this.element = null;
    this.src = src;
    this.mainElement = mainElement;
  }
  init = () => {
    let sound = document.createElement("audio");
    sound.src = this.src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    this.element = sound;
    this.mainElement.appendChild(this.element);
  };

  play = () => {
    this.element.play();
  };

  pause = () => {
    this.element.pause();
  };
}

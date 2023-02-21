document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const playground = document.querySelector(".playground");

  //Bird variables for position, width and height
  let birdLeft = 220;
  let birdBottom = 100;
  let birdWidth = 34;
  let birdHeight = 24;
  //Bird variables for position, width and height
  let pipeWidth = 65;
  let pipeHeight = 300;
  let isGameOver = false;
  let gravity = 2;
  let gap = 400; // gap for top an bottom pipe
  let score = 0;
  let cleared = false;

  //pipe common variables
  let pipeViewPort = 500;

  function startGame() {
    birdBottom -= gravity; // ball drop;
    bird.style.bottom = birdBottom + "px";
    bird.style.left = birdLeft + "px";
  }

  let gametimerID = setInterval(startGame, 20);

  //control key definition
  function control(e) {
    if (e.code === "Space") {
      jump();
    }
  }

  //for ball bounce
  function jump() {
    if (birdBottom < 600) birdBottom += 50; //ball add up with 50 px
    bird.style.bottom = birdBottom + "px";
  }

  document.addEventListener("keyup", control); // added event listener for keyup on 'space'

  //generating pipe or obstacle for bird
  function generatePipe() {
    let randomHeight = -(Math.random() * 80);
    let pipeLeft = 500;
    let pipeBottom = randomHeight;
    const pipe = document.createElement("div");
    let pipeupsidedown = document.createElement("div");
    if (!isGameOver) {
      pipe.classList.add("pipe"); //if not game over it add pipe class for each created element
      pipeupsidedown.classList.add("pipe-upside-down"); //if not game over it add pipe class for each created element
    }
    playground.appendChild(pipe); // adding div element under playground
    playground.appendChild(pipeupsidedown); // adding div element under playground
    pipe.style.left = pipeLeft + "px";
    pipeupsidedown.style.left = pipeLeft + "px";
    pipe.style.bottom = pipeBottom + "px";
    pipeupsidedown.style.bottom = pipeBottom + gap + "px";

    //pipe moving from left to right
    function movePipe() {
      pipeLeft -= 2;
      pipe.style.left = pipeLeft + "px";
      pipeupsidedown.style.left = pipeLeft + "px";

      //disappear the pipe
      if (pipeLeft === -65) {
        clearInterval(timerID);
        playground.removeChild(pipe);
        playground.removeChild(pipeupsidedown);
      }

      // if (
      //   (pipeLeft > 200 &&
      //     pipeLeft < 280 &&
      //     birdLeft === 220 &&
      //     (birdBottom < pipeBottom + 153 ||
      //       birdBottom > pipeBottom + gap - 50)) ||
      //   birdBottom === 0
      // ) {
      //   console.log(birdBottom, pipeBottom);
      //   gameOver();
      //   clearInterval(timerID);
      // }

      if (pipeLeft + pipeWidth < birdLeft + birdWidth && !cleared) {
        console.log(score);
        document.querySelector(".score_number").value = score;
      }

      if (
        (pipeLeft > 200 &&
          pipeLeft < 250 &&
          // birdLeft === 220 &&
          (birdBottom < pipeBottom + pipeHeight ||
            birdBottom > pipeBottom + gap - 27)) ||
        birdBottom === 0
      ) {
        console.log(
          `PipeLeft: ${pipeLeft}, BirdLeft: ${birdLeft}, PipeBottom:${pipeBottom}, BirdBottom:${birdBottom}`
        );
        gameOver();
        clearInterval(timerID);
      }
    }

    let timerID = setInterval(movePipe, 20);
    if (!isGameOver) setTimeout(generatePipe, 3000); //generate new pipe or obstacle for every 3 seconds
  }

  generatePipe();

  function gameOver() {
    clearInterval(gametimerID);
    isGameOver = true;
    document.removeEventListener("keyup", control);
  }
});

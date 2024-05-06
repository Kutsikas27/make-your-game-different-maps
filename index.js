//@ts-nocheck
// Define the initial state of the game
const board = ["pink", "blue", "green"];
const myBoard = []; // Empty array to represent the game board
const ghosts = []; // Array to store ghost objects
let ghostcool = 0; // Counter for ghost movement
let currentLevel = tempBoard; 
const game = {
  x: "",
  y: "",
  h: (window.innerHeight - 75 - 80) / 32, // Calculate the height of the game grid
  size: 32, // Size of each grid cell
  ghosts: 3, // Number of ghosts in the game
  inplay: false, // Flag to indicate if the game is in play or not
  startGhost: [], // Array to store the initial positions of ghosts
};

// Define the initial state of the player
const player = {
  pos: 32, 
  speed: 10, 
  cool: 0, // Cooldown counter for player movement
  pause: false, // Flag to indicate if the game is paused or not
  score: 0,
  lives: 5, 
  gameOver: true, 
  gameWin: false, 
  powerUp: false, 
  powerCount: 0, // Counter for the duration of the power-up
};

const keys = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
};

// Wait for the DOM to be loaded before initializing the game
document.addEventListener("DOMContentLoaded", () => {
  // Get references to game elements
  game.grid = document.querySelector(".grid");
  game.player = document.querySelector(".player");
  game.eye = document.querySelector(".eye");
  game.mouth = document.querySelector(".mouth");
  game.ghost = document.querySelector(".ghost");
  game.score = document.querySelector(".score");
  game.lives = document.querySelector(".lives");
  game.player.style.display = "none";
  game.ghost.style.display = "none";
  game.grid.display = "none";
});

// Handle keydown events
document.addEventListener("keydown", (e) => {
  console.log(e.code)
  if (e.code in keys) {
    keys[e.code] = true;
  }
  if (e.code === "Escape") {
    // Pause the game
    pauseGame();
  }
  if (!game.inplay && !player.pause) {
    // Start the geme
    player.play = requestAnimationFrame(move);
    game.inplay = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code in keys) {
    keys[e.code] = false;
  }
});

startGameBtn.addEventListener("click", () => {
  startGame(tempBoard);
  playMusic();
});

let frames = 0;
let prevTime = Date.now();
// Function to count frames per second
const fpsCounter = () => {
  const currentTime = Date.now();
  frames++;
  if (currentTime - prevTime >= 1000) {
    // Reset the frame counter every second
    console.log(frames)
    frames = 0;
    prevTime = currentTime;
  }
};

// Function to move the player and handle game logic
const move = () => {
  fpsCounter();
  if (game.inplay) {
    // Check if player is caught by ghost
    if (ghosts.some((ghost) => ghost.pos === player.pos)) {
      if (player.powerUp) {
        // player eats ghost
        ghosts.forEach((ghost, i) => {
          if (ghost.pos === player.pos) {
            ghostSound.play();
            player.score += 50;
            ghost.style.backgroundColor = "black";
            ghost.style.opacity = "0.8";
            ghost.pos = game.startGhost[i];
            myBoard[ghost.pos].append(ghost);
          }
        });
      } else {
        // Handle player death
        deathSound.play();
        player.lives--;
        updateScoreAndLives();
        gameReset();
      }
    }

    if (!player.pause && !player.gameOver) {
      player.cool--; // Player cooldown slowdown
      if (player.cool < 0) {
        player.cool = -1;
        movePlayer();
      }
      ghostcool--;
      if (ghostcool < 0) {
        moveGhost();
        player.powerUp ? (ghostcool = 20) : (ghostcool = 10);
      }
    }
    myBoard[player.pos].append(game.player);
    player.play = requestAnimationFrame(move);
  }
};

const applyPowerUp = () => {
  if (player.powerUp) {
    player.powerCount--;
    game.player.style.backgroundColor = "red";
    if (player.powerCount < 20) {
      game.player.style.backgroundColor = "orange";
    }
    if (player.powerCount % 2) {
      game.player.style.backgroundColor = "white";
    }
    if (player.powerCount <= 0) {
      player.powerUp = false;
      game.player.style.backgroundColor = "lightgreen";
    }
  }
};

const stopPowerUp = () => {
  player.powerUp = false;
  player.powerCount = 0;
};

// Function to move the ghosts and handle game logic
const moveGhost = () => {
  applyPowerUp();
  ghosts.forEach((ghost) => {
    if (player.powerCount > 0) {
      if (player.powerCount % 2) {
        ghost.style.backgroundColor = "white";
      } else {
        ghost.style.backgroundColor = "blue";
      }
    } else {
      ghost.style.backgroundColor = ghost.defaultColor;
    }

    myBoard[ghost.pos].append(ghost);
    ghost.counter--;
    const oldPos = ghost.pos; // Original ghost position
    findDirection(ghost);
    if (ghost.counter <= 0) {
      if (ghost.dx == 0) {
        ghost.pos -= game.size;
      }
      if (ghost.dx == 1) {
        ghost.pos += game.size;
      }
      if (ghost.dx == 2) {
        ghost.pos += 1;
      }
      if (ghost.dx == 3) {
        ghost.pos -= 1;
      }
    }

    const valGhost = myBoard[ghost.pos]; // Future position of ghost
    if (valGhost.t == 1) {
      ghost.pos = oldPos;
    }
    myBoard[ghost.pos].append(ghost);
  });
};

const movePlayer = () => {
  const tempPos = player.pos; // Current position
  if (keys.ArrowRight || keys.KeyD) {
    player.pos += 1;
    game.eye.style.left = "20%";
    game.mouth.style.left = "60%";
    player.cool = player.speed; // Set cooldown
  } else if (keys.ArrowLeft || keys.KeyA) {
    player.pos -= 1;
    game.eye.style.left = "60%";
    game.mouth.style.left = "0%";
    player.cool = player.speed; // Set cooldown
  } else if (keys.ArrowUp || keys.KeyW) {
    player.pos -= game.size;
    player.cool = player.speed; // Set cooldown
  } else if (keys.ArrowDown || keys.KeyS) {
    player.pos += game.size;
    player.cool = player.speed; // Set cooldown
  }

  const newPlace = myBoard[player.pos]; // Future position
  if (newPlace.t === 1 || newPlace.t === 4) {
    player.pos = tempPos;
  }
  if (newPlace.t == 2) {
    // Handle dot logic
    myBoard[player.pos].innerHTML = "";
    newPlace.t = 0;
    player.score++;
    updateScoreAndLives();
  }

  if (newPlace.t == 3) {
    // Handle power-up logic
    bonusSound.play();
    player.powerCount = 100;
    player.powerUp = true;
    myBoard[player.pos].innerHTML = "";
    player.score += 10;
    updateScoreAndLives();
    newPlace.t = 0;
  }
  if (newPlace.t == 5) {
    // Handle bonus time logic
    bonusSound.play();
    addSeconds(30);
    myBoard[player.pos].innerHTML = "";
    newPlace.t = 0;
  }
  if (newPlace.t == 26) {
    // Handle exit ladder logic
    const tempDots = document.querySelectorAll(".dot");
    if (tempDots.length === 0) {
      // level switch will happen here
      goToNextLevel(); // Empty function for now
    }
  }
  if (player.pos !== tempPos) {
    if (player.tog) {
      game.mouth.style.height = "30%";
      player.tog = false;
    } else {
      game.mouth.style.height = "10%";
      player.tog = true;
    }
  }
};

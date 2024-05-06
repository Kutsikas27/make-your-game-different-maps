//@ts-nocheck

let startGameBtn = document.querySelector(".btn");

const createGame = (level) => {
  for (let i = 0; i < game.ghosts; i++) {
    createGhost();
  }
  level.forEach((cell) => {
    drawBoard(cell);
  });
  for (let i = 0; i < game.size; i++) {
    game.x += ` ${game.h}px`;
  }
  game.grid.style.gridTemplateColumns = game.x;
  game.grid.style.gridTemplateRows = game.x;
  startPos();
};

const startGame = (level) => {
  startStopwatch();
  myBoard.length = 0;
  ghosts.length = 0;
  game.grid.innerHTML = "";
  game.x = "";

  player.gameOver = false;
  createGame(level);
  game.grid.focus();
  game.grid.display = "grid";
  game.player.style.display = "block";
  startGameBtn.style.display = "none";
};

const gameReset = () => {
  window.cancelAnimationFrame(player.play);
  game.inplay = false;
  player.pause = true;
  if (player.lives <= 0) {
    player.gameOver = true;
    endGame();
  }
  if (!player.gameOver) {
    setTimeout(startPos, 3000);
  }
};

const endGame = () => {
  gameOverModal.style.display = "block";
  stopStopwatch();
  player.gameWin = false;
  player.gameOver = true;
};

const playerWins = () => {
  gameWinModal.style.display = "block";
  player.gameWin = true;
  game.inplay = false;
  player.pause = true;
};

const updateScoreAndLives = () => {
  if (player.lives <= 0) {
    game.lives.innerHTML = "GAME OVER!";
    game.gameOver = true;
    return;
  }
  game.score.innerHTML = `Score: ${player.score}`;
  game.lives.innerHTML = `Lives: ${player.lives}`;
};

const goToNextLevel = () => {
  const levels = [tempBoard, tempBoard2, tempBoard3];
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex === levels.length - 1) {
    playerWins();
  } else {
    currentLevel = levels[currentIndex + 1];
    startGame(currentLevel);
  }
};

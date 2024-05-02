//@ts-nocheck
const pauseModal = document.getElementById("pauseModal");
const gameOverModal = document.getElementById("gameOverModal");
const gameWinModal = document.getElementById("winModal");

// brings up pause menu
function togglePauseModal() {
  if (pauseModal.style.display === "block") {
    pauseModal.style.display = "none";
    return;
  }
  pauseModal.style.display = "block";
}

const restartGame = () => {
  gameOverModal.style.display = "none";
  gameWinModal.style.display = "none";
  player.score = 0;
  player.lives = 5;
  if (
    pauseModal.style.display === "block" ||
    gameOverModal.style.display === "block" ||
    gameWinModal.style.display === "block"
  )
    pauseGame();
  resetStopwatch();
  startGame(tempBoard);
  if (player.powerUp) {
    stopPowerUp();
    game.player.style.backgroundColor = "lightgreen";
  }
};

// toggle for pauseing the game
function pauseGame() {
  player.pause = !player.pause;
  toggleStopwatch();
  togglePauseModal();
}

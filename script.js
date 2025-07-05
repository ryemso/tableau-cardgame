const emojis_6x6 = ['🍎', '🍊', '🍌', '🍉', '🍇', '🍓', '🍒', '🥝', '🍍'];
const emojis_3x3 = ['🍎', '🍊', '🍌', '🍉']; // 발표용: 4쌍
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let timer;
let timeLeft = 90;
let totalMatches = 0;

const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameOverScreen = document.getElementById("game-over");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const fixedBtn = document.getElementById("fixed-btn");
const gameOverRestartBtn = document.getElementById("gameover-restart-btn");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function renderBoard(isFixed = false) {
  board.innerHTML = "";
  board.classList.remove("board-3x3", "board-6x6");

  const selectedEmojis = isFixed ? emojis_3x3 : emojis_6x6;
  cards = shuffle([...selectedEmojis, ...selectedEmojis]);
  totalMatches = selectedEmojis.length;

  board.classList.add(isFixed ? "board-3x3" : "board-6x6");

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${emoji}</div>
      </div>
    `;

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  // 4초 미리보기
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(card => {
      card.classList.add("flipped");
    });
    setTimeout(() => {
      document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("flipped");
      });
    }, 4000);
  }, 100);
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains("flipped")) return;

  this.classList.add("flipped");
  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  attempts++;
  updateScore();

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    updateScore();
    resetTurn();

    if (matches === totalMatches) finishGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateScore() {
  scoreDisplay.textContent = `시도: ${attempts} / 매치: ${matches}`;
}

function startGame(isFixed = false) {
  resetGame();
  renderBoard(isFixed);
  timerDisplay.textContent = `남은 시간: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `남은 시간: ${timeLeft}`;
    if (timeLeft <= 0) finishGame();
  }, 1000);
}

function resetGame() {
  clearInterval(timer);
  [matches, attempts, timeLeft] = [0, 0, 90];
  updateScore();
  gameOverScreen.style.display = "none";
}

function finishGame() {
  clearInterval(timer);
  gameOverScreen.style.display = "flex";
}

// 이벤트 리스너
startBtn.addEventListener("click", () => startGame(false));
restartBtn.addEventListener("click", () => startGame(false));
fixedBtn.addEventListener("click", () => startGame(true));
gameOverRestartBtn.addEventListener("click", () => startGame(false));

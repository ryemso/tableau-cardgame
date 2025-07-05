// 게임 관련 변수 초기화
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let totalMatches = 0;
let timer;
let timeLeft = 90;
let gameStarted = false;
let isPresentationMode = false;

const emojis = [
  "🍎", "🍌", "🍓", "🍉", "🍇", "🍍", "🥝", "🍑"
];

const gameBoard = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const fixedBtn = document.getElementById("fixed-btn");
const result = document.getElementById("result");
const timerDisplay = document.getElementById("timer");
const attemptsDisplay = document.getElementById("attempts");
const matchesDisplay = document.getElementById("matches");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame(presentationMode = false) {
  gameStarted = true;
  isPresentationMode = presentationMode;
  firstCard = null;
  secondCard = null;
  hasFlippedCard = false;
  lockBoard = false;
  matches = 0;
  attempts = 0;
  timeLeft = 90;
  totalMatches = 8; // 4x4
  gameBoard.innerHTML = "";
  result.style.display = "none";
  updateScore();

  const selectedEmojis = [...emojis];
  const gameEmojis = shuffle([...selectedEmojis, ...selectedEmojis]);

  if (!presentationMode) shuffle(gameEmojis);

  gameEmojis.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerHTML = `<div class="card-inner">
      <div class="card-front">${emoji}</div>
      <div class="card-back">?</div>
    </div>`;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });

  setTimeout(() => {
    document.querySelectorAll(".card").forEach(card => {
      card.classList.add("flipped");
    });
    setTimeout(() => {
      document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("flipped");
      });
    }, 1500);
  }, 300);

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      finishGame();
    }
  }, 1000);
}

function flipCard() {
  if (lockBoard || this.classList.contains("flipped") || this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
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
    resetBoard();
    updateScore();
    if (matches === totalMatches) {
      clearInterval(timer);
      finishGame();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function updateScore() {
  attemptsDisplay.textContent = attempts;
  matchesDisplay.textContent = matches;
}

function updateTimer() {
  timerDisplay.textContent = timeLeft;
}

function finishGame() {
  result.style.display = "block";
  result.innerHTML = "🎉 게임 종료! 🎉";
}

startBtn.addEventListener("click", () => startGame(false));
fixedBtn.addEventListener("click", () => startGame(true));
restartBtn.addEventListener("click", () => startGame(isPresentationMode));

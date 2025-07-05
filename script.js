const emojis = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝", "🍍", "🥑", "🧀", "🥕", "🍅", "🍋", "🌽", "🥥", "🍐", "🥬"];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let totalMatches = 0;
let gameStarted = false;
let countdown;
let timeLeft = 90;
let isFixedMode = false;

const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const matchDisplay = document.getElementById("match");
const timeDisplay = document.getElementById("time");
const gameOverScreen = document.getElementById("game-over");
const restartButton = document.getElementById("restart");

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function createCard(emoji) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.emoji = emoji;

  const inner = document.createElement("div");
  inner.classList.add("card-inner");

  const front = document.createElement("div");
  front.classList.add("card-front");
  front.textContent = "?";

  const back = document.createElement("div");
  back.classList.add("card-back");
  back.textContent = emoji;

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener("click", handleCardClick);
  return card;
}

function handleCardClick() {
  if (lockBoard || this.classList.contains("flipped") || this.classList.contains("matched")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
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
    lockBoard = true;
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
  scoreDisplay.textContent = attempts;
  matchDisplay.textContent = matches;
}

function startGame(isFixed = false) {
  isFixedMode = isFixed;
  board.innerHTML = "";
  matches = 0;
  attempts = 0;
  updateScore();
  timeLeft = 90;
  timeDisplay.textContent = timeLeft;
  gameOverScreen.classList.remove("show");

  const pairCount = isFixed ? 4 : 9;
  const selected = isFixed ? emojis.slice(0, 4) : shuffle(emojis).slice(0, pairCount);
  const cards = shuffle([...selected, ...selected]);

  totalMatches = pairCount;

  board.className = "";
  board.classList.add(isFixed ? "board-3x3" : "board-6x6");

  cards.forEach(emoji => board.appendChild(createCard(emoji)));

  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => card.classList.add("flipped"));

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove("flipped"));
    startTimer();
    gameStarted = true;
  }, 4000); // ✅ 4초 동안 카드 미리 보여주기
}

function startTimer() {
  clearInterval(countdown);
  countdown = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) finishGame();
  }, 1000);
}

function finishGame() {
  clearInterval(countdown);
  gameOverScreen.classList.add("show");
}

document.getElementById("start").addEventListener("click", () => startGame(false));
document.getElementById("fixed").addEventListener("click", () => startGame(true));
document.getElementById("restart").addEventListener("click", () => startGame(isFixedMode));
document.getElementById("restart2").addEventListener("click", () => startGame(isFixedMode));

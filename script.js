const emojis = ['🍎','🍌','🍓','🍉','🍇','🍍','🥝','🍑','🥥','🍒','🍋','🍊','🥭','🧀','🍈','🍐','🍏','🍅'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let timer;
let timeLeft = 90;
let gameEnded = false;
let isFixedMode = false;
let totalMatches = 0;

function shuffleCards(useFixed = false) {
  const board = document.getElementById("game-board");
  const baseEmojis = useFixed ? emojis.slice(0, 8) : emojis.slice(0, 18);  // ✅ 4x4 = 8쌍
  const deck = [...baseEmojis, ...baseEmojis];
  if (!useFixed) deck.sort(() => 0.5 - Math.random());

  cards = deck;
  isFixedMode = useFixed;
  totalMatches = baseEmojis.length;
  renderBoard();
  resetScore();
  resetTimer();
  hideOverlay();

  setTimeout(() => {
    showAllCardsTemporarily(() => {
      startTimer();
    });
  }, 100);
}

function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  board.classList.remove("board-6x6", "board-3x3", "board-4x4");
  board.classList.add(isFixedMode ? "board-4x4" : "board-6x6");

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
}

function flipCard() {
  if (lockBoard || gameEnded || this.classList.contains("matched") || this === firstCard) return;
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

    if (matches === totalMatches) finishGame();
    resetTurn();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function resetScore() {
  attempts = 0;
  matches = 0;
  updateScore();
}

function updateScore() {
  document.getElementById("score").textContent = attempts;
  document.getElementById("match").textContent = matches;
  document.getElementById("time").textContent = timeLeft;
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 90;
  updateScore();
}

function startTimer() {
  clearInterval(timer);
  updateScore();

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      finishGame();
    }
  }, 1000);
}

function finishGame() {
  if (gameEnded) return;
  gameEnded = true;
  clearInterval(timer);
  document.getElementById("game-over").classList.remove("hidden");
}

function hideOverlay() {
  document.getElementById("game-over").classList.add("hidden");
  gameEnded = false;
}

function showAllCardsTemporarily(callback) {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => card.classList.add("flipped"));
  lockBoard = true;

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove("flipped"));
    lockBoard = false;
    if (typeof callback === "function") callback();
  }, 4000);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start").addEventListener("click", () => shuffleCards(false));
  document.getElementById("fixed").addEventListener("click", () => shuffleCards(true));
  document.getElementById("restart").addEventListener("click", () => shuffleCards(isFixedMode));
  document.getElementById("restart2").addEventListener("click", () => shuffleCards(isFixedMode));
});

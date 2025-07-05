// ✅ script.js (완성)

const emojis = ['🍎','🍌','🍓','🍉','🍇','🍍','🥝','🍑','🥥','🍒','🍋','🍊','🥭','🧀','🍈','🍐','🍏','🍅'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let timer;
let timeLeft = 80;
let gameEnded = false;
let totalMatches = 0;

function shuffleCards(useFixed = false) {
  const board = document.getElementById("game-board");

  const baseEmojis = useFixed ? emojis.slice(0, 4) : emojis.slice(0, 18);
  const deck = [...baseEmojis, ...baseEmojis];
  if (!useFixed) deck.sort(() => 0.5 - Math.random());

  cards = deck;
  totalMatches = baseEmojis.length;

  renderBoard(useFixed);
  resetScore();
  resetTimer();
  hideOverlay();

  setTimeout(() => {
    showAllCardsTemporarily(() => {
      startTimer();
    });
  }, 100);
}

function renderBoard(isFixed = false) {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  board.classList.remove("board-6x6", "board-3x3");
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
    }, 800);
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
  document.getElementById("attempts").textContent = attempts;
  document.getElementById("matches").textContent = matches;
  document.getElementById("timer").textContent = timeLeft;
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 80;
  updateScore();
}

function startTimer() {
  clearInterval(timer);
  updateScore();

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;

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
  document.getElementById("overlay").classList.remove("hidden");
}

function hideOverlay() {
  document.getElementById("overlay").classList.add("hidden");
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
  document.getElementById("shuffle-btn").addEventListener("click", () => {
    shuffleCards();
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    shuffleCards();
  });

  document.getElementById("shuffle-fixed-btn").addEventListener("click", () => {
    shuffleCards(true);
  });

  document.getElementById("overlay-restart-btn").addEventListener("click", () => {
    shuffleCards();
  });
});

const emojis = ['🍎','🍌','🍓','🍉','🍇','🍍','🥝','🍑','🥥','🍒','🍋','🍊','🥭','🫐','🍈','🍐','🍏','🍅'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let timer;
let timeLeft = 80;
let gameEnded = false;


function shuffleCards() {
  const deck = [...emojis.slice(0, 18), ...emojis.slice(0, 18)].sort(() => 0.5 - Math.random());
  cards = deck;

  gameEnded = false;
  document.getElementById("overlay").classList.add("hidden");
  
  renderBoard();
  resetScore();
  resetTurn();
  resetTimer();
  
  showAllCardsTemporaily();
  
   setTimeout(() => {
    startTimer();      // ⏱ 타이머 시작!
  }, 4000); 
}

function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

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

    if (matches === 18) finishGame();
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
  document.getElementById("attempts").textContent = attempts;
  document.getElementById("matches").textContent = matches;
  document.getElementById("timer").textContent = timeLeft;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 80;
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

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("shuffle-btn").addEventListener("click", shuffleCards);
  document.getElementById("restart-btn").addEventListener("click", shuffleCards);
  shuffleCards();
});


function showAllCardsTemporarily() {
  const allCards = document.querySelectorAll(".card");
  lockBoard = true;
  allCards.forEach(card => card.classList.add("flipped"));

  setTimeout(() => {
    allCards.forEach(card => card.classList.remove("flipped"));
    lockBoard = false;
  }, 4000);
}


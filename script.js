const emojis = ['🍎','🍌','🍓','🍉','🍇','🍍','🥝','🍑','🥥','🍒','🍋','🍊','🥭','🫐','🍈','🍐','🍏','🍅'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let timer;
let timeLeft = 60;

function shuffleCards() {
  const deck = [...emojis.slice(0, 18), ...emojis.slice(0, 18)];
  deck.sort(() => 0.5 - Math.random());
  cards = deck;
  renderBoard();
  resetScore();
  resetTimer();
  document.getElementById("overlay").classList.add("hidden");
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
  if (lockBoard || this.classList.contains("matched") || this === firstCard) return;

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
    if (matches === 18) {
      endGame();
    }
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
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 60;
  document.getElementById("timer").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  document.getElementById("overlay").classList.remove("hidden");
}

shuffleCards();

const emojis = ['🍎', '🍌', '🍓', '🍉', '🍇', '🍍', '🥝', '🍑'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let timer = 60;
let timerInterval;

function shuffleCards() {
  const deck = [...emojis, ...emojis];
  deck.sort(() => 0.5 - Math.random());
  cards = deck;
  renderBoard();
  resetScore();
  startTimer();
  document.getElementById("completion").classList.add("hidden");
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
    if (matches === emojis.length) {
      clearInterval(timerInterval);
      document.getElementById("completion").classList.remove("hidden");
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
  updateScore();
}

function resetScore() {
  attempts = 0;
  matches = 0;
  updateScore();
}

function updateScore() {
  document.getElementById("attempts").textContent = attempts;
  document.getElementById("matches").textContent = matches;
  const remaining = emojis.length - matches;
  document.getElementById("remaining").textContent = remaining;
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 60;
  document.getElementById("timer").textContent = timer;
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById("timer").textContent = timer;
    if (timer === 0) {
      clearInterval(timerInterval);
      lockBoard = true;
      alert("⏱ 시간이 초과되었습니다!");
    }
  }, 1000);
}

shuffleCards();

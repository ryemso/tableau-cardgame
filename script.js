const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🥝', '🍑', '🍐', '🍍', '🧀', '🥕', '🍅', '🍈', '🥑', '🌽', '🥥'];
const FIXED_EMOJIS = ['🍎', '🍋', '🍇', '🍒'];

let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let totalMatches = 0;
let timerInterval;
let remainingTime = 90;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
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

    board.appendChild(card);
  });

  // ✅ 전체 카드 4초간 자동 공개 → 그 후 닫힘
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(card => {
      card.classList.add("flipped");
    });
    setTimeout(() => {
      document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("flipped");
        card.addEventListener("click", flipCard);
      });
    }, 4000);
  }, 10); // 아주 짧은 딜레이로 렌더링 후 실행
}

function flipCard() {
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

function updateScore() {
  document.getElementById("matches").textContent = matches;
  document.getElementById("attempts").textContent = attempts;
}

function startTimer() {
  clearInterval(timerInterval);
  remainingTime = 90;
  document.getElementById("time").textContent = remainingTime;

  timerInterval = setInterval(() => {
    remainingTime--;
    document.getElementById("time").textContent = remainingTime;
    if (remainingTime <= 0) finishGame();
  }, 1000);
}

function finishGame() {
  clearInterval(timerInterval);
  document.getElementById("game-over-modal").classList.remove("hidden");
}

function restartGame() {
  document.getElementById("game-over-modal").classList.add("hidden");
  startGame(); // 기본은 6x6
}

function startGame() {
  cards = shuffle([...EMOJIS, ...EMOJIS].slice(0, 18)); // 18쌍
  totalMatches = cards.length / 2;
  matches = 0;
  attempts = 0;
  updateScore();
  renderBoard(false);
  startTimer();
}

function startFixedGame() {
  isFixedMode = true;
  matches = 0;
  tries = 0;
  timeLeft = 90;
  gameOver = false;
  gameOverMessage.style.display = "none";

  const selected = EMOJIS.slice(0, 6); // 6쌍
  cards = shuffle([...selected, ...selected]);
  totalMatches = 6;

  renderBoard(true);
  updateScore();
  startTimer();
}

const EMOJIS = [
  "🍎", "🍐", "🍊", "🍋", "🍌", "🍉",
  "🍇", "🍓", "🧀", "🥝", "🍒", "🥭",
  "🍍", "🍑", "🍈", "🍅", "🫐", "🌽"
];
const FIXED_EMOJIS = ["🍎", "🍌", "🍇"]; // 발표용 고정 낱말판

let cards = [];
let flippedCards = [];
let lockBoard = false;
let matches = 0;
let tries = 0;
let timer;
let timeLeft = 90;
let totalMatches = 0;

// --------------------- 초기화 함수 ---------------------
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateScore() {
  document.getElementById("score").textContent =
    `시도: ${tries} / 매치: ${matches} / 남은 시간: ${timeLeft}`;
}

function hideModal() {
  document.getElementById("modal").style.display = "none";
}

function showModal() {
  document.getElementById("modal").style.display = "flex";
}

// --------------------- 타이머 ---------------------
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateScore();
    if (timeLeft <= 0) finishGame();
  }, 1000);
}

// --------------------- 게임 보드 렌더 ---------------------
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

// --------------------- 카드 클릭 처리 ---------------------
function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains("flipped")) return;

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  tries++;

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
  flippedCards = [];
  lockBoard = false;
}

// --------------------- 게임 제어 ---------------------
function finishGame() {
  clearInterval(timer);
  showModal();
}

function startGame() {
  hideModal();

  cards = shuffle([...EMOJIS, ...EMOJIS]);
  totalMatches = cards.length / 2;
  matches = 0;
  tries = 0;
  timeLeft = 90;

  updateScore();
  renderBoard(false);
  startTimer();
}

function startFixedGame() {
  hideModal();

  cards = [...FIXED_EMOJIS, ...FIXED_EMOJIS]; // 총 6장
  totalMatches = cards.length / 2;
  matches = 0;
  tries = 0;
  timeLeft = 90;

  updateScore();
  renderBoard(true);
  startTimer();
}

// --------------------- 버튼 연결 ---------------------
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("fixed-btn").addEventListener("click", startFixedGame);
document.getElementById("restart-btn").addEventListener("click", startGame);

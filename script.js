const emojisPool = ["🍎", "🍇", "🍉", "🍌", "🍑", "🍒", "🍍", "🥝", "🍐", "🍊", "🍓", "🥥"];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let totalMatches = 0;
let timer;
let timeLeft = 90;
let isFixedMode = false;
let gameStarted = false;

// 🟢 시작 함수
function startGame(fixed = false) {
  isFixedMode = fixed;
  gameStarted = true;
  matches = 0;
  attempts = 0;
  timeLeft = 90;
  updateScore();

  cards = fixed ? getFixedCards() : getRandomCards();
  totalMatches = cards.length / 2;

  renderBoard();
  document.getElementById("game-over").style.display = "none";
  clearInterval(timer);
  startTimer();
}

// 🟢 카드 셔플 (랜덤용)
function getRandomCards() {
  const selected = emojisPool.sort(() => 0.5 - Math.random()).slice(0, 6); // 6쌍
  return shuffle([...selected, ...selected]);
}

// 🟢 고정 모드 카드
function getFixedCards() {
  const fixed = ["🍎", "🍌", "🍒", "🍉"]; // 4쌍
  return [...fixed, ...fixed];
}

// 🟢 카드 섞기
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 🟢 보드 렌더
function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  board.className = isFixedMode ? "board-3x3" : "board-6x6";

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.className = "card";
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

  // 🟢 4초 보여주기
  document.querySelectorAll(".card").forEach(card => card.classList.add("flipped"));
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(card => card.classList.remove("flipped"));
  }, 4000);
}

// 🟢 카드 뒤집기
function flipCard(e) {
  if (lockBoard || !gameStarted) return;
  const card = e.currentTarget;
  if (card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  attempts++;
  updateScore();

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    resetTurn();
    updateScore();
    checkGameEnd();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 700);
  }
}

// 🟢 점수/턴수 업데이트
function updateScore() {
  document.getElementById("attempts").textContent = attempts;
  document.getElementById("matches").textContent = matches;
}

// 🟢 게임 종료 확인
function checkGameEnd() {
  if (!gameStarted) return;
  if (matches === totalMatches) {
    clearInterval(timer);
    document.getElementById("game-over").style.display = "block";
  }
}

// 🟢 타이머 시작
function startTimer() {
  document.getElementById("time-left").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      document.getElementById("game-over").style.display = "block";
    }
  }, 1000);
}

// 🟢 턴 초기화
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

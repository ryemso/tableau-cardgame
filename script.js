// 게임 관련 변수 초기화
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let totalMatches = 0;
let timer;
let timeLeft = 80;
let gameStarted = false;
let isPresentationMode = false;

const emojis = [
  "🍎", "🍌", "🍓", "🍉", "🍇", "🍍", "🥝", "🍑"
];

const gameBoard = document.getElementById("game-board");
const gameEndDiv = document.getElementById("game-end");
const attemptsDisplay = document.getElementById("attempts");
const matchesDisplay = document.getElementById("matches");
const timeLeftDisplay = document.getElementById("timeLeft");

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
  timeLeft = 80;
  
  gameBoard.innerHTML = "";
  gameEndDiv.classList.add("hidden");
  updateScore();
  updateTimer();
  
  let selectedEmojis, gameEmojis;
  
  if (presentationMode) {
    // 발표용: 4x4 (8쌍)
    totalMatches = 8;
    selectedEmojis = [...emojis];
    gameEmojis = shuffle([...selectedEmojis, ...selectedEmojis]);
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gameBoard.style.maxWidth = '400px';
  } else {
    // 일반 게임: 6x6 (18쌍)
    totalMatches = 18;
    const extendedEmojis = [
      "🍎", "🍌", "🍓", "🍉", "🍇", "🍍", "🥝", "🍑",
      "🍊", "🍋", "🥭", "🍐", "🍒", "🥥", "🫐", "🍈",
      "🥦", "🥕"
    ];
    selectedEmojis = [...extendedEmojis];
    gameEmojis = shuffle([...selectedEmojis, ...selectedEmojis]);
    gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
    gameBoard.style.maxWidth = '600px';
  }
  
  gameEmojis.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerHTML = `<div class="card-inner">
  <div class="card-front">❓</div>
  <div class="card-back">${emoji}</div>
</div>`;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
  
  // 게임 시작 시 잠시 모든 카드 보여주기
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
  
  // 타이머 시작
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

function startPresentationMode() {
  startGame(true);
}

function resetGame() {
  clearInterval(timer);
  gameStarted = false;
  gameBoard.innerHTML = "";
  gameEndDiv.classList.add("hidden");
  matches = 0;
  attempts = 0;
  timeLeft = 80;
  updateScore();
  updateTimer();
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
  timeLeftDisplay.textContent = timeLeft;
}

function finishGame() {
  gameEndDiv.classList.remove("hidden");
  if (matches === totalMatches) {
    gameEndDiv.innerHTML = `🎉 게임 클리어! 🎉<br />
      시도: ${attempts}회, 남은 시간: ${timeLeft}초<br />
      <button onclick="resetGame()">다시 시작</button>`;
  } else {
    gameEndDiv.innerHTML = `⏰ 시간 종료! ⏰<br />
      매칭: ${matches}/${totalMatches}<br />
      <button onclick="resetGame()">다시 시작</button>`;
  }
}

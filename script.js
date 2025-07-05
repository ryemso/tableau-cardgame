const emojis = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍑', '🍉'];
let shuffledCards = [];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let timer;
let timeLeft = 90;
let totalMatches = 8;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard(cards) {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerHTML = "<span class='card-back'>❓</span><span class='card-front'>" + emoji + "</span>";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function startGame() {
  resetGame();
  shuffledCards = shuffle([...emojis, ...emojis]);
  createBoard(shuffledCards);
  revealCardsTemporarily();
  startTimer();
}

function startFixedGame() {
  resetGame();
  // ✅ 발표용도 무작위로 섞되 같은 이모지 구성
  shuffledCards = shuffle([...emojis, ...emojis]);
  createBoard(shuffledCards);
  revealCardsTemporarily();
  startTimer();
}

function restartGame() {
  clearInterval(timer);
  document.getElementById("game-message").innerText = "";
  startGame();
}

function flipCard() {
  if (lockBoard || this.classList.contains("matched") || this.classList.contains("flipped")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  attempts++;
  updateStats();

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    updateStats();
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

function updateStats() {
  document.getElementById("attempts").innerText = attempts;
  document.getElementById("matches").innerText = matches;
}

function revealCardsTemporarily() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => card.classList.add("flipped"));
  setTimeout(() => cards.forEach(card => card.classList.remove("flipped")), 4000);
}

function startTimer() {
  timeLeft = 90;
  document.getElementById("timer").innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft === 0) finishGame();
  }, 1000);
}

function finishGame() {
  clearInterval(timer);
  document.getElementById("game-message").innerHTML = "🎉 게임 종료! 🎉";
}

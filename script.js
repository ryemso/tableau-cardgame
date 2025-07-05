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
    let gameStarted = false;

    // --------------------- 초기화 함수 ---------------------
    function shuffle(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    }

    function updateScore() {
      document.getElementById("attempts").textContent = tries;
      document.getElementById("matches").textContent = matches;
      document.getElementById("timer").textContent = timeLeft;
    }

    function hideOverlay() {
      document.getElementById("overlay").classList.add("hidden");
    }

    function showOverlay() {
      document.getElementById("overlay").classList.remove("hidden");
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

    function stopTimer() {
      clearInterval(timer);
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
      if (!gameStarted) return;
      if (lockBoard) return;
      if (this.classList.contains("flipped")) return;
      if (this.classList.contains("matched")) return;
      
      this.classList.add("flipped");
      flippedCards.push(this);
      
      if (flippedCards.length === 2) {
        checkMatch();
      }
    }

    function checkMatch() {
      const [firstCard, secondCard] = flippedCards;
      tries++;
      updateScore();
      
      if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matches++;
        updateScore();
        
        // 게임 완료 체크
        if (matches === totalMatches) {
          setTimeout(() => finishGame(), 500);
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
      flippedCards = [];
      lockBoard = false;
    }

    // --------------------- 게임 제어 ---------------------
    function finishGame() {
      gameStarted = false;
      stopTimer();
      showOverlay();
    }

    function initGame() {
      hideOverlay();
      matches = 0;
      tries = 0;
      timeLeft = 90;
      gameStarted = false;
      lockBoard = false;
      flippedCards = [];
      stopTimer();
      updateScore();
    }

    function startGame() {
      initGame();
      // 18개의 서로 다른 이모지를 선택하여 36장 카드 생성
      const selectedEmojis = EMOJIS.slice(0, 18);
      cards = shuffle([...selectedEmojis, ...selectedEmojis]);
      totalMatches = selectedEmojis.length;
      renderBoard(false);
      gameStarted = true;
      startTimer();
    }

    function startFixedGame() {
      initGame();
      // 고정 게임도 반드시 섞어야 함
      cards = shuffle([...FIXED_EMOJIS, ...FIXED_EMOJIS]);
      totalMatches = FIXED_EMOJIS.length;
      renderBoard(true);
      gameStarted = true;
      startTimer();
    }

    // --------------------- 버튼 연결 ---------------------
    document.getElementById("shuffle-btn").addEventListener("click", startGame);
    document.getElementById("restart-btn").addEventListener("click", startGame);
    document.getElementById("shuffle-fixed-btn").addEventListener("click", startFixedGame);
    document.getElementById("overlay-restart-btn").addEventListener("click", startGame);

    // 초기 상태 설정
    updateScore();

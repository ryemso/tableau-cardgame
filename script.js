const cardSymbols = [
    '🍎', '🍌', '🍓', '🍉', '🍇', '🍍', '🥝', '🍑'
];

const startButton = document.getElementById('startButton');
const fixedButton = document.getElementById('fixedButton');
const restartButton = document.getElementById('restartButton');
const gameBoard = document.getElementById('gameBoard');
const attemptsDisplay = document.getElementById('attempts');
const matchesDisplay = document.getElementById('matches');
const timerDisplay = document.getElementById('timer');
const gameOverMessage = document.getElementById('gameOver');
const restartOverlayButton = document.getElementById('restartOverlayButton');

let cards = [];
let firstCard = null;
let secondCard = null;
let attempts = 0;
let matches = 0;
let timer;
let timeLeft = 90;
let isGameStarted = false;

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = '<span class="symbol">?</span>';
    card.dataset.symbol = symbol;
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function startGame(fixed = false) {
    gameBoard.innerHTML = '';
    cards = [];
    firstCard = null;
    secondCard = null;
    attempts = 0;
    matches = 0;
    timeLeft = 90;
    isGameStarted = true;
    updateDisplay();
    gameOverMessage.classList.add('hidden');

    let selectedSymbols = [...cardSymbols];
    let selected = selectedSymbols.slice(0, 8);
    let gameSymbols = [...selected, ...selected];
    if (!fixed) shuffleArray(gameSymbols);

    gameSymbols.forEach(symbol => {
        const card = createCard(symbol);
        cards.push(card);
        gameBoard.appendChild(card);
    });

    setTimeout(() => {
        cards.forEach(card => card.querySelector('.symbol').textContent = '?');
        cards.forEach(card => card.classList.remove('flipped'));
    }, 4000);

    cards.forEach(card => {
        card.querySelector('.symbol').textContent = card.dataset.symbol;
        card.classList.add('flipped');
    });

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function updateDisplay() {
    attemptsDisplay.textContent = attempts;
    matchesDisplay.textContent = matches;
    timerDisplay.textContent = timeLeft;
}

function flipCard(card) {
    if (!isGameStarted || card.classList.contains('flipped') || secondCard) return;

    card.querySelector('.symbol').textContent = card.dataset.symbol;
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        attempts++;
        updateDisplay();

        if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
            matches++;
            updateDisplay();
            firstCard = null;
            secondCard = null;
            if (matches === 8) endGame();
        } else {
            setTimeout(() => {
                firstCard.querySelector('.symbol').textContent = '?';
                secondCard.querySelector('.symbol').textContent = '?';
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard = null;
                secondCard = null;
            }, 700);
        }
    }
}

function endGame() {
    isGameStarted = false;
    gameOverMessage.classList.remove('hidden');
    clearInterval(timer);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startButton.addEventListener('click', () => startGame(false));
fixedButton.addEventListener('click', () => startGame(false)); // 랜덤으로 변경
restartButton.addEventListener('click', () => startGame(false));
restartOverlayButton.addEventListener('click', () => startGame(false));

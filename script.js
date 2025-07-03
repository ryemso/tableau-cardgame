
const fruits = ["🍎", "🍌", "🍇", "🍓", "🍉", "🍒", "🍑", "🥝", "🍍", "🍊", "🥥", "🍋"];
const cards = [...fruits, ...fruits].sort(() => Math.random() - 0.5);
let selected = [];
let matched = [];

function render() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";
    const isFlipped = matched.includes(index) || selected.includes(index);
    div.textContent = isFlipped ? card : "❓";
    div.onclick = () => onCardClick(index);
    board.appendChild(div);
  });
}

function onCardClick(index) {
  if (selected.includes(index) || matched.includes(index)) return;
  selected.push(index);
  if (selected.length === 2) {
    const [a, b] = selected;
    if (cards[a] === cards[b]) {
      matched.push(a, b);
    }
    setTimeout(() => {
      selected = [];
      render();
    }, 1000);
  }
  render();
}

window.onload = render;

function shuffleCards() {
  selected = [];
  matched = [];
  cards.sort(() => Math.random() - 0.5);
  render();
}



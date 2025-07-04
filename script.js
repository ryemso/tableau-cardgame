/* style.css */
body {
  font-family: 'Arial', sans-serif;
  text-align: center;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
}

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

#scoreboard {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 15px;
  font-size: 1.2em;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  margin-bottom: 15px;
  border: none;
  border-radius: 10px;
  background-color: #4CAF50;
  color: white;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

#game-board {
  display: grid;
  grid-template-columns: repeat(6, 80px);
  grid-template-rows: repeat(6, 80px);
  gap: 10px;
  justify-content: center;
  margin: auto;
}

.card {
  width: 80px;
  height: 80px;
  perspective: 1000px;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-front {
  background-color: #f9f9f9;
}

.card-back {
  transform: rotateY(180deg);
}

.card.matched {
  animation: pop 0.4s ease;
  background-color: #c8f7c5;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  z-index: 999;
  flex-direction: column;
}

#overlay.hidden {
  display: none;
}

#restart-btn {
  margin-top: 20px;
  padding: 10px 30px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#restart-btn:hover {
  background-color: #0b7dda;
}

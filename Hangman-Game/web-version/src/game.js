const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

const MAX_ATTEMPTS = 8;

let chosenWord = "";
let displayWord = [];
let attempts = MAX_ATTEMPTS;
let guessedLetters = new Set();
let currentWord = null;
let gameOver = false;

/* ===== WORD PICK ===== */
function pickWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  chosenWord = currentWord.word.toLowerCase();
  displayWord = Array(chosenWord.length).fill("_");
}

/* ===== UI UPDATE ===== */
function updateDisplay() {
  document.getElementById("wordDisplay").innerText = displayWord.join(" ");
  document.getElementById("category").innerText = `Category: ${currentWord.category}`;

  document.getElementById("attempts").innerHTML =
    "Attempts: " + "❤️ ".repeat(attempts);

  if (!document.getElementById("hint").classList.contains("hidden")) {
    document.getElementById("hint").innerText = `Hint: ${currentWord.hint}`;
  }
}

/* ===== DRAW HANGMAN ===== */
function drawHangman() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#38bdf8";

  const parts = [
    () => ctx.moveTo(40, 260) || ctx.lineTo(220, 260),
    () => ctx.moveTo(80, 260) || ctx.lineTo(80, 40),
    () => ctx.lineTo(180, 40),
    () => ctx.lineTo(180, 70),
    () => ctx.moveTo(180, 90) || ctx.arc(180, 110, 20, 0, Math.PI * 2),
    () => ctx.moveTo(180, 130) || ctx.lineTo(180, 200),
    () => ctx.moveTo(180, 150) || ctx.lineTo(150, 180),
    () => ctx.moveTo(180, 150) || ctx.lineTo(210, 180),
    () => ctx.moveTo(180, 200) || ctx.lineTo(150, 240),
    () => ctx.moveTo(180, 200) || ctx.lineTo(210, 240)
  ];

  const step = MAX_ATTEMPTS - attempts;
  if (parts[step]) {
    ctx.beginPath();
    parts[step]();
    ctx.stroke();
  }
}

/* ===== GUESS HANDLER ===== */
function handleGuess(letter) {
  if (gameOver || guessedLetters.has(letter)) return;

  guessedLetters.add(letter);
  disableKey(letter);

  if (chosenWord.includes(letter)) {
    for (let i = 0; i < chosenWord.length; i++) {
      if (chosenWord[i] === letter) {
        displayWord[i] = letter;
      }
    }
  } else {
    attempts--;
    drawHangman();
    shakeCanvas();
  }

  updateDisplay();
  checkGameState();
}

/* ===== GAME STATE ===== */
function checkGameState() {
  if (!displayWord.includes("_")) {
    document.getElementById("attempts").innerText = "🎉 You Win!";
    endGame();
  }

  if (attempts === 0) {
    document.getElementById("attempts").innerText =
      `❌ You Lose! Word: ${chosenWord}`;
    revealWord();
    endGame();
  }
}

function endGame() {
  gameOver = true;
}

/* ===== KEYBOARD ===== */
function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  "qwertyuiopasdfghjklzxcvbnm".split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.id = `key-${letter}`;
    btn.innerText = letter;
    btn.onclick = () => handleGuess(letter);
    keyboard.appendChild(btn);
  });
}

function disableKey(letter) {
  const btn = document.getElementById(`key-${letter}`);
  if (btn) btn.classList.add("disabled");
}

/* ===== EFFECTS ===== */
function shakeCanvas() {
  canvas.classList.add("shake");
  setTimeout(() => canvas.classList.remove("shake"), 300);
}

/* ===== REVEAL WORD ===== */
function revealWord() {
  displayWord = chosenWord.split("");
  document.getElementById("wordDisplay").innerText = displayWord.join(" ");
}

/* ===== EVENTS ===== */
document.addEventListener("keydown", e => {
  const letter = e.key.toLowerCase();
  if (/^[a-z]$/.test(letter)) handleGuess(letter);
});

document.getElementById("restartBtn").onclick = startGame;
document.getElementById("hintBtn").onclick = () => {
  document.getElementById("hint").classList.remove("hidden");
  document.getElementById("hint").innerText = `Hint: ${currentWord.hint}`;
};

/* ===== START GAME ===== */
function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  attempts = MAX_ATTEMPTS;
  guessedLetters.clear();
  gameOver = false;

  document.getElementById("hint").classList.add("hidden");

  pickWord();
  updateDisplay();
  createKeyboard();
}

startGame();

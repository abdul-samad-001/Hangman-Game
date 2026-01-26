const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

const MAX_ATTEMPTS = 8;

let currentWordObj = null;
let chosenWord = "";
let displayWord = [];
let attempts = MAX_ATTEMPTS;
let guessedLetters = new Set();
let gameOver = false;

function pickWord() {
  currentWordObj = words[Math.floor(Math.random() * words.length)];
  chosenWord = currentWordObj.word.toLowerCase();
  displayWord = Array(chosenWord.length).fill("_");
}

function updateDisplay() {
  document.getElementById("wordDisplay").innerText = displayWord.join(" ");
  document.getElementById("category").innerText =
    `Category: ${currentWordObj.category}`;

  document.getElementById("attempts").innerHTML =
    "Attempts: " + "❤️ ".repeat(attempts);

  const hintEl = document.getElementById("hint");
  if (!hintEl.classList.contains("hidden")) {
    hintEl.innerText = `Hint: ${currentWordObj.hint}`;
  }
}
function drawHangman() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#38bdf8";

  const parts = [
    () => { 
      ctx.moveTo(40, 260);
      ctx.lineTo(220, 260);
    },
    () => { 
      ctx.moveTo(80, 260);
      ctx.lineTo(80, 40);

      ctx.moveTo(80, 40);
      ctx.lineTo(170, 40);
    },
    () => { 
      ctx.moveTo(170, 40);
      ctx.lineTo(170, 80);
    },
    () => { 
      ctx.moveTo(170, 100);
      ctx.arc(170, 100, 20, 0, Math.PI * 2);

      ctx.moveTo(163, 95);
      ctx.arc(163, 95, 2, 0, Math.PI * 2);

      ctx.moveTo(177, 95);
      ctx.arc(177, 95, 2, 0, Math.PI * 2);
    },
    () => { 
      ctx.moveTo(170, 120);
      ctx.lineTo(170, 190);
    },
    () => { 
      ctx.moveTo(170, 140);
      ctx.lineTo(145, 165);

      ctx.moveTo(170, 140);
      ctx.lineTo(195, 165);
    },
    () => { 
      ctx.moveTo(170, 190);
      ctx.lineTo(150, 235);
    },
    () => { 
      ctx.moveTo(170, 190);
      ctx.lineTo(190, 235);
    }
  ];

  const step = MAX_ATTEMPTS - attempts;
  if (parts[step]) {
    ctx.beginPath();
    parts[step]();
    ctx.stroke();
  }
}


function handleGuess(letter) {
  if (gameOver || guessedLetters.has(letter)) return;

  guessedLetters.add(letter);
  disableKey(letter);

  if (chosenWord.includes(letter)) {
    chosenWord.split("").forEach((char, index) => {
      if (char === letter) displayWord[index] = letter;
    });
  } else {
    attempts--;
    drawHangman();
    shakeCanvas();
  }

  updateDisplay();
  checkGameState();
}

function checkGameState() {
  if (!displayWord.includes("_")) {
    document.getElementById("attempts").innerText = "🎉 You Win!";
    gameOver = true;
  }

  if (attempts === 0) {
    document.getElementById("attempts").innerText =
      `❌ You Lose! Word: ${chosenWord}`;
    revealWord();
    gameOver = true;
  }
}

function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  const rows = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"]
  ];

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    row.forEach(letter => {
      const btn = document.createElement("button");
      btn.className = "key";
      btn.id = `key-${letter}`;
      btn.innerText = letter;
      btn.onclick = () => handleGuess(letter);
      rowDiv.appendChild(btn);
    });

    keyboard.appendChild(rowDiv);
  });
}

function disableKey(letter) {
  const btn = document.getElementById(`key-${letter}`);
  if (btn) btn.classList.add("disabled");
}

function shakeCanvas() {
  canvas.classList.add("shake");
  setTimeout(() => canvas.classList.remove("shake"), 300);
}

function revealWord() {
  displayWord = chosenWord.split("");
  document.getElementById("wordDisplay").innerText = displayWord.join(" ");
}

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();
  if (/^[a-z]$/.test(key)) handleGuess(key);
});

document.getElementById("restartBtn").onclick = startGame;
document.getElementById("hintBtn").onclick = () => {
  const hintEl = document.getElementById("hint");
  hintEl.classList.remove("hidden");
  hintEl.innerText = `Hint: ${currentWordObj.hint}`;
};

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





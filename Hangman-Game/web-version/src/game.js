const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

let hintUsed = false;
let chosenWord = "";
let displayWord = [];
let attempts = 8;
let guessed = new Set();

let current = null;
function pickWord() {
    current = words[Math.floor(Math.random()*words.length)];
    chosenWord = current.word.toLowerCase();
    displayWord = Array(chosenWord.length).fill("_");
}


function updateDisplay() {
    document.getElementById("wordDisplay").innerText = displayWord.join(" ");
    document.getElementById("category").innerText = `Category: ${current.category}`;
    document.getElementById("hint").innerText = `Hint: ${current.hint}`;
    document.getElementById("attempts").innerText = `Attempts left: ${attempts}`;
}

function drawHangman() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#222";

    const parts = [
        () => ctx.moveTo(50,280) || ctx.lineTo(250,280),   // ground
        () => ctx.moveTo(100,280) || ctx.lineTo(100,50),   // pole
        () => ctx.lineTo(200,50),                          // top
        () => ctx.lineTo(200,80),                          // rope
        () => ctx.moveTo(200,90) || ctx.arc(200,110,20,0,Math.PI*2), // head
        () => ctx.moveTo(200,130) || ctx.lineTo(200,200),  // body
        () => ctx.moveTo(200,150) || ctx.lineTo(170,180),  // left arm
        () => ctx.moveTo(200,150) || ctx.lineTo(230,180),  // right arm
        () => ctx.moveTo(200,200) || ctx.lineTo(170,240),  // left leg
        () => ctx.moveTo(200,200) || ctx.lineTo(230,240),  // right leg
    ];

    let index = 10 - attempts;
    if (parts[index-1]) {
        ctx.beginPath();
        parts[index-1]();
        ctx.stroke();
    }
}

function handleGuess(letter) {
    if (guessed.has(letter) || attempts <= 0) return;
    guessed.add(letter);

    if (!chosenWord.includes(letter)) {
        attempts--;
        drawHangman();
    } else {
        for (let i=0; i<chosenWord.length; i++) {
            if (chosenWord[i] === letter) displayWord[i] = letter;
        }
    }

    updateDisplay();
    checkEnd();
    disableKey(letter);
}

function disableKey(letter) {
    const btn = document.getElementById(`key-${letter}`);
    if (btn) btn.classList.add("disabled");
}

function checkEnd() {
    if (!displayWord.includes("_")) {
        document.getElementById("attempts").innerText = "You Win 🎉";
    } else if (attempts === 0) {
        document.getElementById("attempts").innerText = `You Lose ❌ Word: ${chosenWord}`;
    }
}

function createKeyboard() {
    const kb = document.getElementById("keyboard");
    const letters = "qwertyuiopasdfghjklzxcvbnm".split("");

    kb.innerHTML = "";
    letters.forEach(l => {
        const btn = document.createElement("button");
        btn.className = "key";
        btn.id = `key-${l}`;
        btn.innerText = l;
        btn.onclick = () => handleGuess(l);
        kb.appendChild(btn);
    });
}

document.addEventListener("keydown", (e)=>{
    let l = e.key.toLowerCase();
    if (/[a-z]/.test(l) && l.length===1) handleGuess(l);
});

document.getElementById("restartBtn").onclick = startGame;
document.getElementById("hintBtn").onclick = () => {
    document.getElementById("hint").innerText = `Hint: ${current.hint}`;
    document.getElementById("hint").classList.remove("hidden");
    hintUsed = true;
};


function startGame() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    attempts = 8;
    guessed.clear();
    hintUsed = false;
    document.getElementById("hint").classList.add("hidden");
    pickWord();
    updateDisplay();
    createKeyboard();
}

startGame();


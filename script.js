// ========== SIMPLIFIED JAVASCRIPT (3rd sem friendly) ==========

// --- GAME STATE VARIABLES ---
let currentScore = 0;
let highScore = 0;
let gameRunning = true;
let timeRemaining = 5;
let timerInterval = null;

// --- CURRENT QUESTION DATA ---
let currentQuestionText = "";
let correctAnswer = 0;
let answerOptions = [];

// --- GET HTML ELEMENTS ---
const scoreSpan = document.getElementById("scoreDisplay");
const bestSpan = document.getElementById("bestDisplay");
const timerSpan = document.getElementById("timerValue");
const questionDiv = document.getElementById("question");
const optionsContainer = document.getElementById("optionsDiv");
const messageBox = document.getElementById("msgBox");
const resetButton = document.getElementById("resetGame");
const gameBoxElement = document.getElementById("gameBox");

// --- LOAD HIGH SCORE ---
function loadHighScore() {

  let saved = localStorage.getItem("mathCrushBest");

  if (saved !== null) {
    highScore = parseInt(saved);

    if (isNaN(highScore)) {
      highScore = 0;
    }

  } else {
    highScore = 0;
  }

  bestSpan.innerText = highScore;
}

// --- UPDATE HIGH SCORE ---
function updateHighScore() {

  if (currentScore > highScore) {

    highScore = currentScore;
    bestSpan.innerText = highScore;

    localStorage.setItem("mathCrushBest", highScore);

    messageBox.innerText = "🎉 NEW HIGH SCORE! 🎉";

    setTimeout(() => {

      if (gameRunning && messageBox.innerText.includes("NEW HIGH")) {
        messageBox.innerText = "✨ keep going! ✨";
      }

    }, 1500);
  }
}

// --- REFRESH SCORE UI ---
function refreshScoreUI() {

  scoreSpan.innerText = currentScore;

  if (currentScore > highScore) {
    updateHighScore();
  }
}

// --- CREATE RANDOM QUESTION ---
function createRandomMathQuestion() {

  let operation = Math.floor(Math.random() * 3);

  let num1;
  let num2;
  let answer;
  let questionStr;

  if (operation === 0) {

    num1 = Math.floor(Math.random() * 15) + 2;
    num2 = Math.floor(Math.random() * 15) + 2;

    answer = num1 + num2;

    questionStr = num1 + " + " + num2;

  }

  else if (operation === 1) {

    num1 = Math.floor(Math.random() * 20) + 10;

    num2 = Math.floor(Math.random() * (num1 - 1)) + 1;

    answer = num1 - num2;

    questionStr = num1 + " - " + num2;

  }

  else {

    num1 = Math.floor(Math.random() * 10) + 1;

    num2 = Math.floor(Math.random() * 9) + 1;

    answer = num1 * num2;

    questionStr = num1 + " × " + num2;
  }

  return {
    question: questionStr + " = ?",
    correct: answer
  };
}

// --- GENERATE OPTIONS ---
function generateFourOptions(correctNum) {

  let optionsSet = new Set();

  optionsSet.add(correctNum);

  while (optionsSet.size < 4) {

    let offset = Math.floor(Math.random() * 9) - 4;

    let candidate = correctNum + offset;

    if (candidate < 0) {
      candidate = correctNum + 1;
    }

    if (candidate === correctNum) {
      candidate = correctNum + 1;
    }

    if (candidate > 70) {
      candidate = correctNum - 2;
    }

    if (candidate < 0) {
      candidate = correctNum + 2;
    }

    optionsSet.add(candidate);
  }

  let optsArray = Array.from(optionsSet);

  for (let i = optsArray.length - 1; i > 0; i--) {

    let j = Math.floor(Math.random() * (i + 1));

    [optsArray[i], optsArray[j]] = [optsArray[j], optsArray[i]];
  }

  return optsArray;
}

// --- LOAD NEW QUESTION ---
function loadNewQuestion() {

  if (!gameRunning) {
    return;
  }

  let qData = createRandomMathQuestion();

  currentQuestionText = qData.question;

  correctAnswer = qData.correct;

  answerOptions = generateFourOptions(correctAnswer);

  questionDiv.innerText = currentQuestionText;

  optionsContainer.innerHTML = "";

  for (let i = 0; i < answerOptions.length; i++) {

    let optionValue = answerOptions[i];

    let btn = document.createElement("button");

    btn.classList.add("opt-btn");

    btn.innerText = optionValue;

    btn.addEventListener("click", function () {
      handleAnswerClick(optionValue);
    });

    optionsContainer.appendChild(btn);
  }
}

// --- TIMER DURATION ---
function getTimerDuration() {

  if (currentScore < 50) return 5;

  if (currentScore < 120) return 4;

  if (currentScore < 220) return 3;

  return 2;
}

// --- START TIMER ---
function startQuestionTimer() {

  if (timerInterval !== null) {

    clearInterval(timerInterval);

    timerInterval = null;
  }

  timeRemaining = getTimerDuration();

  timerSpan.innerText = timeRemaining;

  timerInterval = setInterval(function () {

    if (!gameRunning) {

      if (timerInterval) {
        clearInterval(timerInterval);
      }

      return;
    }

    if (timeRemaining <= 1) {

      clearInterval(timerInterval);

      timerInterval = null;

      if (gameRunning) {
        gameOver("⏰ TIME OUT! game over ⏰");
      }

    } else {

      timeRemaining--;

      timerSpan.innerText = timeRemaining;

      if (timeRemaining <= 1) {

        document.body.style.background =
          "linear-gradient(135deg, #ffcfc4, #ffc0d0)";

      } else {

        document.body.style.background =
          "linear-gradient(135deg, #ffe9c4, #ffd9e8)";
      }
    }

  }, 1000);
}

// --- HANDLE ANSWER CLICK ---
function handleAnswerClick(selectedNumber) {

  if (!gameRunning) {
    return;
  }

  if (selectedNumber === correctAnswer) {

    currentScore = currentScore + 10;

    refreshScoreUI();

    messageBox.innerText = "✅ CORRECT! +10 points! ✅";

    gameBoxElement.classList.add("correct-effect");

    setTimeout(function () {

      gameBoxElement.classList.remove("correct-effect");

    }, 200);

    document.body.style.background =
      "linear-gradient(135deg, #d4ffd4, #fbffd4)";

    setTimeout(function () {

      if (gameRunning) {

        document.body.style.background =
          "linear-gradient(135deg, #ffe9c4, #ffd9e8)";
      }

    }, 200);

    if (timerInterval) {

      clearInterval(timerInterval);

      timerInterval = null;
    }

    loadNewQuestion();

    startQuestionTimer();

  } else {

    let correctAnsMsg = correctAnswer;

    gameOver(
      "❌ WRONG! Correct answer was " + correctAnsMsg + " ❌"
    );

    gameBoxElement.classList.add("wrong-effect");

    setTimeout(function () {

      gameBoxElement.classList.remove("wrong-effect");

    }, 300);
  }
}

// --- GAME OVER ---
function gameOver(reason) {

  if (!gameRunning) {
    return;
  }

  gameRunning = false;

  if (timerInterval) {

    clearInterval(timerInterval);

    timerInterval = null;
  }

  messageBox.innerHTML =
    `${reason} <br> 🎯 FINAL SCORE: ${currentScore} 🎯`;

  let allBtns = document.querySelectorAll(".opt-btn");

  for (let i = 0; i < allBtns.length; i++) {

    allBtns[i].disabled = true;

    allBtns[i].style.opacity = "0.5";

    allBtns[i].style.cursor = "default";
  }

  document.body.style.background =
    "linear-gradient(135deg, #ffcfcf, #fbc4d4)";

  timerSpan.innerText = "0";
}

// --- RESET GAME ---
function resetGame() {

  if (timerInterval) {

    clearInterval(timerInterval);

    timerInterval = null;
  }

  gameRunning = true;

  currentScore = 0;

  refreshScoreUI();

  let freshData = createRandomMathQuestion();

  currentQuestionText = freshData.question;

  correctAnswer = freshData.correct;

  answerOptions = generateFourOptions(correctAnswer);

  questionDiv.innerText = currentQuestionText;

  optionsContainer.innerHTML = "";

  for (let i = 0; i < answerOptions.length; i++) {

    let optVal = answerOptions[i];

    let btn = document.createElement("button");

    btn.classList.add("opt-btn");

    btn.innerText = optVal;

    btn.addEventListener("click", function () {

      handleAnswerClick(optVal);

    });

    optionsContainer.appendChild(btn);
  }

  startQuestionTimer();

  messageBox.innerText = "🌟 NEW GAME! good luck 🌟";

  setTimeout(() => {

    if (gameRunning && messageBox.innerText.includes("NEW GAME")) {

      messageBox.innerText = "💡 choose answer quickly! 💡";
    }

  }, 2000);

  document.body.style.background =
    "linear-gradient(135deg, #ffe9c4, #ffd9e8)";

  let oldBtns = document.querySelectorAll(".opt-btn");

  for (let i = 0; i < oldBtns.length; i++) {

    oldBtns[i].disabled = false;

    oldBtns[i].style.opacity = "1";
  }
}

// --- RESET BUTTON EVENT ---
resetButton.addEventListener("click", function () {

  resetGame();
});

// --- INITIALIZE GAME ---
function initializeGame() {

  loadHighScore();

  currentScore = 0;

  refreshScoreUI();

  gameRunning = true;

  let initData = createRandomMathQuestion();

  currentQuestionText = initData.question;

  correctAnswer = initData.correct;

  answerOptions = generateFourOptions(correctAnswer);

  questionDiv.innerText = currentQuestionText;

  optionsContainer.innerHTML = "";

  for (let i = 0; i < answerOptions.length; i++) {

    let val = answerOptions[i];

    let btn = document.createElement("button");

    btn.classList.add("opt-btn");

    btn.innerText = val;

    btn.addEventListener("click", function () {

      handleAnswerClick(val);

    });

    optionsContainer.appendChild(btn);
  }

  startQuestionTimer();

  messageBox.innerText =
    "🌸 tap correct answer before timer ends! 🌸";
}

// --- START GAME ---
initializeGame();
/* Script for Guess the Number */

let turn = 0,
  higherNum = 0,
  lowerNum = 0,
  recentNum = 0;

const turnValue = document.querySelector("#turnValue");
const higherValue = document.querySelector("#higherValue");
const lowerValue = document.querySelector("#lowerValue");
const recentValue = document.querySelector("#recentValue");

const inputField = document.querySelector("#gameInput");
const submitBtn = document.querySelector("#submitBtn");
const clearBtn = document.querySelector("#clearBtn");
const playBtn = document.querySelector("#playBtn");

const scoreValue = document.querySelector("#gameScore");
const highScoreValue = document.querySelector("#highScore");

const gameLabel = document.querySelector(".game__label");
const targetNum = generateNumber();

highScoreValue.textContent = parseInt(localStorage.getItem("gtn_highScore"));

mainScript();

function mainScript() {

  highScoreCheck();
  limitCheck();

  submitBtn.addEventListener("click", function (e) {
    checkNumber();
  });

  inputField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      checkNumber();
    }
  });
  
  clearBtn.addEventListener("click", function (e) {
    clearInput();
  });  

  playBtn.addEventListener("click", function (e) {
    window.location.reload();
  });
}

// Utility Scripts

function generateNumber() {
  const generatedNum = Math.floor(Math.random() * 1000) + 1;
  console.log(generatedNum);
  return generatedNum;
}

function highScoreCheck() {
  if (isNaN(localStorage.getItem("gtn_highScore")) || isNaN(highScoreValue.textContent)) { //check if highScore is NaN
    localStorage.setItem("gtn_highScore", 0);
    highScoreValue.textContent = parseInt(localStorage.getItem("gtn_highScore"));
  }
}

function limitCheck() {
  if (inputField.value.length >= 3 && !["Backspace", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) {
    e.preventDefault();
  }
  
  inputField.addEventListener("input", function (e) {
    if (inputField.value.length > 3) {
      inputField.value = inputField.value.slice(0, 3);
    }
  });
}

function checkNumber() {
  const inputNumText = document.querySelector("#gameInput").value;
  const inputNum = parseInt(inputNumText);

  if (inputNum === targetNum) {
    alert("Congratulations! You guessed the number!");
    inputField.setAttribute("readOnly", true);
    inputField.style.cursor = "default";
    gameLabel.textContent = "You guessed the number!";
    gameLabel.style.color = "var(--p-cyan)";

    playBtn.style.display = "block";
    submitBtn.style.display = "none";
    clearBtn.style.display = "none";
    
    calculateScore();

  }

  else {
    if (inputNum > targetNum) {

      if (turn > 0) {
        lowerNum = Math.min(inputNum, lowerNum);

        if (lowerNum === 0) {
          lowerNum = inputNum;
        }

      } 
      
      else {
        lowerNum = inputNum;
      }

      lowerValue.textContent = lowerNum;
    }

    else if (inputNum < targetNum) {

      if (turn > 0) {
        higherNum = Math.max(inputNum, higherNum);
        
        if (higherNum === 0) {
          higherNum = inputNum;
        }
      }

      else {
        higherNum = inputNum;
      }

      higherValue.textContent = higherNum;
    }

    recentNum = inputNum;
    recentValue.textContent = recentNum;

    if (inputField.value == "") {
      recentValue.textContent = 0;
    }

  }

  turn++;
  turnValue.textContent = turn;
}

function clearInput() {
  inputField.value = "";
}

function calculateScore() {
  const score = 100 - turn;
  
  scoreValue.textContent = score;
  highScoreValue.textContent = Math.max(score, parseInt(localStorage.getItem("gtn_highScore")));
  localStorage.setItem("gtn_highScore", highScoreValue.textContent);

}
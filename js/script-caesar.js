/* CAESAR CIPHER */

const shifter = document.querySelector(".shifter");
const shifterNumbers = document.querySelectorAll(".shifter__tab__numbers");

const inputLabel = document.querySelector("#inputLabel");
const outputLabel = document.querySelector("#outputLabel");
 
const inputText = document.querySelector("#inputText");
const outputText = document.querySelector("#outputText");

const trashBtns = document.querySelectorAll(".bx-trash");
const copyBtn = document.querySelector(".bx-copy");
const copyMsg = document.querySelector("#copyMessage");

const inputImage = document.querySelector("#imgSwap");
let cipherMode = "to plain";

main();

function main() {
    applyDefaultShift();
    modifyShifter();
    
    setCipher();
    flipTranslator();
    setButtons();
}


function applyDefaultShift() {
    shifterNumbers[0].style.color = "black";
    shifterNumbers[0].style.backgroundColor = "var(--p-violet)";
    shifterNumbers[0].active = true;
}

function modifyShifter() {
    for (const number of shifterNumbers) {
        number.addEventListener("click", () => {

            for (const otherNumber of shifterNumbers) {
                otherNumber.style.color = "";
                otherNumber.style.backgroundColor = "";
                otherNumber.active = false;
            }

            number.style.color = "black";
            number.style.backgroundColor = "var(--p-violet)";
            number.active = true;
        });

    }

    console.log(shifterNumbers);
}

function setCipher() {
    inputText.addEventListener("input", () => {
        translateCipher();
    });
    
    for (const number of shifterNumbers) { //for of
        number.addEventListener("click", () => {
            translateCipher();
        });

    }
}

function translateCipher() {
    let shift = 0;
    for (const number of shifterNumbers) {
        if (number.active) {
            shift = parseInt(number.textContent);
        }
    }

    shift = (cipherMode === "to plain") ? shift : (-shift + 26);
    console.log(shift);

    let input = inputText.value;
    let output = "";

    for (let i = 0; i < input.length; i++) {
        let char = input[i];
        if (char.match(/[a-z]/i)) {
            let code = input.charCodeAt(i);
            if ((code >= 65) && (code <= 90)) {
                char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
            } else if ((code >= 97) && (code <= 122)) {
                char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
        }
        output += char;
    }

    outputText.value = output;
}

function setButtons() { //forEach
    trashBtns.forEach((trashBtn) => {
        trashBtn.addEventListener("click", () => {
            inputText.value = "";
            outputText.value = "";
        });
    });

    copyBtn.addEventListener("click", () => {
        outputText.select();
        document.execCommand("copy");
        copyMsg.style.display = "inline-block";

        setTimeout(function () {
            copyMsg.style.display = "none";
        }, 3000); //delay is in milliseconds 

    });

    
}


function flipTranslator() {
    inputImage.addEventListener("click", () => { 
        if (inputImage.complete) {
            inputImage.classList.toggle('flipped');
            
            cipherMode = (cipherMode === "to plain") ? "to cipher" : "to plain";
            
            let tempText = inputText.value;
            inputText.value = outputText.value;
            outputText.value = tempText;
            
            let tempLabel = inputLabel.textContent;
            inputLabel.textContent = outputLabel.textContent;
            outputLabel.textContent = tempLabel;
            
            
          } else {
            inputImage.onload = () => {
                inputImage.classList.toggle('flipped');
            }
          }
    });
    
   
}
/* THE CIVILIZATIONS */

let rowNum = 0;
let attempt = 1;
const IMG_SRCS = 5;
const PATTERN_ROWS = 3;

const patternCodes = [];
let imgCodes = [];

let codeX, codeY, codeZ;

const scoreValue = document.querySelector("#gameScore");
const highScoreValue = document.querySelector("#highScore");
highScoreValue.textContent = parseInt(localStorage.getItem("gtn_highScore"));

const navigations = [
    Array.from(document.querySelector(`#nav_container${rowNum}`).children)
];

const responses = [
    Array.from(document.querySelector(`#response_container${rowNum}`).children)
];

main();

function main() {
    highScoreCheck();
    generatePattern();
    initializeNavigations();
    newRound();
}

function highScoreCheck() {
    if (isNaN(localStorage.getItem("gtn_highScore")) || isNaN(highScoreValue.textContent)) { //check if highScore is NaN
        localStorage.setItem("gtn_highScore", 0);
        highScoreValue.textContent = parseInt(localStorage.getItem("gtn_highScore"));
    }
}

function generatePattern() {

    const tempCodes = Array.from({ length: 3 },
        () => Math.floor(Math.random() * 5) + 1);

    patternCodes.push(...tempCodes);
    console.log(JSON.stringify(patternCodes));
}

function initializeNavigations() {
    console.log(navigations);

    navigations[rowNum].forEach((nav) => {
        nav.setAttribute("src", "res/civil/card-back.png");
        nav.style.cursor = "pointer";
    });
}

function newRound() {
    initializeNewBoard();

    onNavigation();
    onSubmit();
}

function initializeNewBoard() {
    // Create a new game__board element
    const newGameBoard = document.createElement('div');
    newGameBoard.className = 'game__board';
    newGameBoard.id = `gameBoard${rowNum + 1}`; // Ensure the ID is unique

    // Clone the inner HTML of the existing game__board
    const existingGameBoard = document.querySelector(`#gameBoard${rowNum}`);
    if (existingGameBoard) {
        newGameBoard.innerHTML = existingGameBoard.innerHTML;

        // Update IDs to ensure they are unique
        newGameBoard.querySelectorAll('[id]').forEach(function (el) {
            el.id = el.id.replace(/\d+$/, function (match) {
                return parseInt(match) + 1;
            });
        });

        newGameBoard.querySelector(".button").id = `btnSubmit${rowNum + 1}`;
        newGameBoard.querySelector(".button").classList.remove("button__submit");

        Array.from(newGameBoard.querySelector(".navigation__container").children).forEach(nav => {
            nav.classList.add("img__default-cursor");
        });

        newGameBoard.classList.add("inactive__board");

        // Find the points__tab element
        const pointsTab = document.querySelector('.points__tab');

        // Check if pointsTab exists
        if (pointsTab && pointsTab.parentNode) {
            // Insert the new game__board before the points__tab
            pointsTab.parentNode.insertBefore(newGameBoard, pointsTab);
        } else {
            console.error('points__tab element not found');
        }

        if (rowNum > 0) {
            navigations.push(Array.from(document.querySelector(`#nav_container${rowNum}`).children));
            responses.push(Array.from(document.querySelector(`#response_container${rowNum}`).children));
        }
    } else {
        console.error(`Existing game board #gameBoard${rowNum} not found`);
    }
}


function onNavigation() {
    codeX = retrieveImageCode("res/civil/0.png");
    codeY = retrieveImageCode("res/civil/0.png");
    codeZ = retrieveImageCode("res/civil/0.png");

    navigations[rowNum].forEach((nav, index) => {
        let pointer = 1;

        nav.addEventListener("click", () => {
            nav.setAttribute("src", `res/civil/${pointer}.png`);

            pointer++;
            if (pointer > IMG_SRCS) {
                pointer = 1;
            }

            switch (index) {
                case 0: codeX = retrieveImageCode(nav.getAttribute("src"));
                    break;

                case 1: codeY = retrieveImageCode(nav.getAttribute("src"));
                    break;

                case 2: codeZ = retrieveImageCode(nav.getAttribute("src"));
                    break;
            }

        });
    });

}

function retrieveImageCode(navSrc) {
    const codeIndex = navSrc.indexOf('/', navSrc.indexOf('/') + 1) + 1;
    const imgCode = navSrc.substring(codeIndex, navSrc.indexOf('.'));
    return imgCode;
}

function onSubmit() {
    const handleClick = () => {
        imgCodes = [Number(codeX), Number(codeY), Number(codeZ)];

        for (let i = 0; i < PATTERN_ROWS; i++) {
            if (imgCodes[i] === patternCodes[i]) {
                responses[rowNum][i].style.backgroundColor = "var(--p-cyan)";
                responses[rowNum][i].style.borderColor = "var(--p-cyan)";
            }

            else {
                let foundMatch = false;

                for (let j = 0; j < PATTERN_ROWS; j++) {
                    if (imgCodes[i] === patternCodes[j]) {
                        responses[rowNum][i].style.backgroundColor = "var(--p-yellow)";
                        responses[rowNum][i].style.borderColor = "var(--p-yellow)";
                        foundMatch = true;
                        break;
                    }
                }

                if (!foundMatch) {
                    responses[rowNum][i].style.backgroundColor = "var(--p-scarlet)";
                    responses[rowNum][i].style.borderColor = "var(--p-scarlet)";
                }

            }
        }

        if (JSON.stringify(imgCodes) === JSON.stringify(patternCodes)) {
            onVictory();
        }

        else {
            rowNum++;
            attempt++;
            cleanPreviousBoard();
            cleanNextBoard();
            newRound();
        }

    };

    const btnSubmit = document.querySelector(`#btnSubmit${rowNum}`);

    if (btnSubmit) {
        btnSubmit.addEventListener("click", handleClick);
    } else {
        console.error(`Submit button #btnSubmit${rowNum} not found`);
    }

}

function cleanPreviousBoard() {
    const nextBoard = document.querySelector(`#gameBoard${rowNum - 1}`);
    nextBoard.classList.add("inactive__board");

    Array.from(nextBoard.querySelector(".navigation__container").children).forEach(nav => {
        nav.classList.add("img__default-cursor");
    });

    // Remove all event listeners from navigations[rowNum-1]
    navigations[rowNum - 1].forEach(nav => {
        const newNav = nav.cloneNode(true);
        nav.parentNode.replaceChild(newNav, nav);
    });

    // Nuke all event listeners from the submit button
    const prevButton = document.querySelector(`#btnSubmit${rowNum - 1}`);
    prevButton.classList.remove("button__submit");
    prevButton.replaceWith(prevButton.cloneNode(true));

}

function cleanNextBoard() {
    const nextBoard = document.querySelector(`#gameBoard${rowNum}`);
    nextBoard.classList.remove("inactive__board");

    Array.from(nextBoard.querySelector(".navigation__container").children).forEach(nav => {
        nav.classList.remove("img__default-cursor");
    });

    const nextButton = document.querySelector(`#btnSubmit${rowNum}`);
    nextButton.classList.add("button__submit");
}

function onVictory() {
    alert("You got the code!");
    calculateScore();
}

const calculateScore = () => {
    const score = 100 - attempt;

    gameScore.textContent = score;
    highScoreValue.textContent = Math.max(score, parseInt(localStorage.getItem("gtn_highScore")));
    localStorage.setItem("gtn_highScore", highScoreValue.textContent);
}
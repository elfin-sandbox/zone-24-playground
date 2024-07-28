/* Script for Home Page */

const cardContainer = document.querySelector(".card-container");
const soonCard = document.querySelector("#soonCard");
const soonCardIndex = Array.prototype.indexOf.call(cardContainer.children, soonCard) + 1;

soonCardModifier();

function soonCardModifier() {
    
    if (soonCardIndex % 3 === 0) {
        soonCard.style.width = "100%";
        soonCard.style.textAlign = "center";
        soonCard.style.fontSize = "1.15rem";
    }
    
    else {
        soonCard.style.width = "calc(50% - 1rem);";
        soonCard.style.textAlign = "center";
        soonCard.style.fontSize = "1.5rem";
    }
}
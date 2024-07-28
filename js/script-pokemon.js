
const dexText = document.querySelector("#dexText");
const dexPkmn = document.querySelector("#dexPkmn");
const choices = document.querySelectorAll(".choice");
const dexResponse = document.querySelector(".dex__response");
let targetPkmn = "";

const nextBtn = document.querySelector("#nextBtn");
const restartBtn = document.querySelector("#restartBtn");

const streak = document.querySelector("#streak");
const highStreak = document.querySelector("#highStreak");

let choiceClicked = false;
let streakValue = parseInt(document.querySelector("#streak").textContent);
let highStreakValue = parseInt(document.querySelector("#highStreak").textContent);

main();

function main() {
    continueGame();
    initializeButtons();
    activateChoices();
}


function continueGame() {
    highStreak.textContent =  localStorage.getItem('pkmn_highStreak') ? highStreakValue = parseInt(localStorage.getItem('pkmn_highStreak')) : highStreakValue = 0;
    
    initializeContents();
    setTimeout(fetchPokemon, 500);
}

function initializeContents() {
    dexText.textContent = "Loading...";
    dexPkmn.setAttribute('src', '');
    choices.forEach(choice => { 
        choice.style.opacity = 1;
        choice.textContent = "Loading...";
        choice.style.backgroundColor = "black";
        choice.style.boxShadow = `0 7px 0px 0 ${shadowColor('#4CAF50', 1.00)}`;
        
        choice.disabled = false;
        choice.style.cursor = "pointer";
    });
    
    dexResponse.textContent = "Who's That Pokémon?";
    dexResponse.style.color = "var(--primary-color)";
    
    nextBtn.classList.remove('btn--active');
    restartBtn.classList.remove('btn--active');
    
    choiceClicked = false;
}

async function fetchPokemon() {
    const targetIndex = Math.floor(Math.random() * 3.9);
    const targetId = Math.floor(Math.random() * 1000) + 1;
    // const targetIndex = 4;
    
    const randomIds = [];
    for (let i = 0; i < 4; i++) {
        let randomId = Math.floor(Math.random() * 1000) + 1;
        randomIds.push(randomId);
    }
    
    // targetID = 123;
    // console.log(targetId);
    // console.log(targetIndex);
    
    try {
        // Start all requests in parallel        
        const fetchPromises =[];
        for (let i = 0; i < 4; i++) {
            if (i === 0) {
                fetchPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon-species/${targetId}`));
                fetchPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${targetId}`));
            }
            
            else {
                fetchPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${randomIds[i]}`));
            }
            
        }
        
        const [targetDexResponse, targetSpriteReponse, choiceResponse1, choiceResponse2, choiceResponse3] = await Promise.all(fetchPromises);

        // Parse all responses
        const [targetDexData, targetSpriteData, choiceData1, choiceData2, choiceData3] = await Promise.all([
            targetDexResponse.json(), targetSpriteReponse.json(), choiceResponse1.json(), choiceResponse2.json(), choiceResponse3.json()
        ]); 
        
        // Retrieve Pokemons     
        targetPkmn = capitalize(targetDexData.name);
        const choice1Pkmn = capitalize(choiceData1.name);
        const choice2Pkmn = capitalize(choiceData2.name);
        const choice3Pkmn = capitalize(choiceData3.name);
        const choicePkmns = [choice1Pkmn, choice2Pkmn, choice3Pkmn];
        
        const targetType = targetSpriteData.types[0].type.name;
        const choice1Type = choiceData1.types[0].type.name;
        const choice2Type = choiceData2.types[0].type.name;
        const choice3Type = choiceData3.types[0].type.name;
        const choiceTypes = [choice1Type, choice2Type, choice3Type];
            
        const choiceArray = [];
        const targetArray = [];
        const colorArray = [];
        
        console.log(targetPkmn, choice1Pkmn, choice2Pkmn, choice3Pkmn);

        for (let i = 0, j = 0; i < 4; i++) {
            if (i === targetIndex) {
                choiceArray.push(targetPkmn);
                targetArray.push(targetType);
                colorArray.push(toColor(targetType));
            } 
            
            else {
                choiceArray.push(choicePkmns[j]);
                targetArray.push(choiceTypes[j]);
                colorArray.push(toColor(choiceTypes[j]));
                j++;
            }
        }
        
        // console.log(choiceArray);
        // console.log(targetArray);
        // console.log(colorArray);

        // Process dex entry
        const englishEntry = targetDexData.flavor_text_entries.filter(entry => entry.language.name === 'en');
        let dexEntry = englishEntry[1]?.flavor_text.replace(/[\n\f]/g, ' ') || 'Description not available.';
        
        if (dexEntry.includes(targetPkmn.toLowerCase()) || dexEntry.includes(targetPkmn.toUpperCase())) {
            dexEntry = dexEntry.slice(dexEntry.indexOf(".") + 1, dexEntry.length);
        }
    
        dexText.textContent = dexEntry;

        // Process dex sprite
        const spriteURL = targetSpriteData.sprites.other?.['official-artwork']?.front_default;
        dexPkmn.setAttribute('src', spriteURL);
        dexPkmn.classList.add('dex__pkmn--filter');
        
        // Process buttons
        for(let i = 0; i < choices.length; i++) {
            choices[i].textContent = choiceArray[i];
            choices[i].style.backgroundColor = colorArray[i];
            choices[i].style.boxShadow = `0 7px 0px 0 ${shadowColor(colorArray[i], 0.55)}`;
        }
    
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

function toColor(targetType) {
    switch (targetType) {
        case 'normal':
            return '#A8A77A';
        case 'flying':
            return '#A98FF3';
        case 'electric':
            return '#F7D02C';
        case 'fighting':
            return '#C22E28';
        case 'ground':
            return '#E2BF65';
        case 'rock':
            return '#B6A136';
        case 'fire':
            return '#EE8130';
        case 'grass':
            return '#7AC74C';
        case 'bug':
            return '#A6B91A';  
        case 'water':
            return '#56b3fe';
        case 'ice':
            return '#96D9D6';
        case 'psychic':
            return '#F95587';
        case 'poison':
            return '#A33EA1';
        case 'ghost':
            return '#735797';
        case 'steel':
            return '#B7B7CE';
        case 'dark':
            return '#a0a0a0';
        case 'dragon':
            return '#6F35FC';
        case 'fairy':
            return '#D685AD';
        case 'unknown':
            return '#68A090';
        case 'shadow':
            return '#000000';
        default:
            return '#373737';
    }
}

function shadowColor(color, percent) {
    // Convert color to RGB format if it's hex
    let r, g, b;
    if (color[0] === '#') {
        color = color.slice(1);
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);
    } else {
        [r, g, b] = color.match(/\d+/g).map(Number);
    }

    // Calculate the amount to darken
    r = Math.max(0, Math.min(255, r * (1 - percent)));
    g = Math.max(0, Math.min(255, g * (1 - percent)));
    b = Math.max(0, Math.min(255, b * (1 - percent)));

    // Convert RGB to hex
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initializeButtons() { 
    nextBtn.addEventListener('click', () => {
        continueGame();
    });
    
    restartBtn.addEventListener('click', () => {
        streakValue = 0;
        streak.textContent = streakValue;
        continueGame();
    });
}

function activateChoices() {
    
    choices.forEach(choice => { 
        choice.addEventListener('click', () => {
            
            if (!choiceClicked) {
                checkChoice();
                choiceClicked = true;
            }
            
            if (choice.textContent === capitalize(targetPkmn)) {
                choices.forEach(choice => { 
                    choice.style.opacity = 0.5;
                });
                
                choice.style.backgroundColor = 'var(--p-cyan)';
                choice.style.boxShadow = `0 7px 0px 0 ${shadowColor('#00ffc8', 0.55)}`;
                choice.style.opacity = 1;
                
                dexResponse.textContent = "Correct!";
                dexResponse.style.color = "var(--p-cyan)";
                
                streakValue++;
                streak.textContent = streakValue;
                
                highStreakValue = Math.max(streakValue, highStreakValue);
                highStreak.textContent = highStreakValue;
                localStorage.setItem('pkmn_highStreak', highStreakValue);
            } 
            
            else {
                choices.forEach(choice => { 
                    choice.style.opacity = 0.5;
                    if (choice.textContent === capitalize(targetPkmn)) {
                        choice.style.backgroundColor = 'var(--p-cyan)';
                        choice.style.boxShadow = `0 7px 0px 0 ${shadowColor('#00ffc8', 0.55)}`;
                        choice.style.opacity = 1;
                    }
                });
                
                choice.style.backgroundColor = 'var(--p-scarlet)';
                choice.style.boxShadow = `0 7px 0px 0 ${shadowColor('#ff2426', 0.55)}`;
                choice.style.opacity = 1;
                
                dexResponse.textContent = "Try again!";
                dexResponse.style.color = "var(--p-scarlet)";
                
                streakValue = 0;
                streak.textContent = streakValue;
            }
            
        });
        
    });
    
    
}

function checkChoice() {

    dexPkmn.classList.remove('dex__pkmn--filter');

    choices.forEach(choice => {
        choice.disabled = true;
        choice.style.cursor = "default";
    });

    // setTimeout(continueGame, 2000);

    nextBtn.classList.add('btn--active');
    restartBtn.classList.add('btn--active');

    nextBtn.removeAttribute("disabled");
    restartBtn.removeAttribute("disabled");

}
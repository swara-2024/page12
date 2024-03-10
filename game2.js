let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = true; // Game starts as not started
let timerSeconds = 30;
let timerInterval;
let target; // Target will be set dynamically
let totalAttempts = 0;
let correctAttempts = 0;

let tomatoSound = new Audio('./tomato.mp3');
let grapesSound = new Audio('./angoor.mp3');

window.onload = function() {
    document.getElementById("start-button").addEventListener("click", startGame);
}

document.addEventListener("DOMContentLoaded", function() {
    // Simulate a delay to hide the loader after 3 seconds (3000 milliseconds)
    setTimeout(function() {
        // Hide the loader after 3 seconds
        document.querySelector('.loading').classList.add('loaded');
    }, 3000);
});

function startGame() {
    resetGame();
    setGame();
    startTimer();
    gameOver = false;

    // Redirect to result.html page with score parameter
}


function setGame() {
    updateTargetHeading();
    // Set up the grid in html
    for (let i = 0; i < 6; i++) { //i goes from 0 to 8, stops at 9
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 3000); 
    setInterval(setPlant, 4000); 
}

function resetGame() {
    clearInterval(timerInterval);
    score = 0;
    timerSeconds = 30;
    totalAttempts = 0;
    correctAttempts = 0;
    updateScore();
    updateTimerDisplay();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds <= 0) {
            endGame();
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById("timer").innerText = "Time Left: " + timerSeconds + "s";
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 6);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./tomato-img.png";
    mole.addEventListener("click", playTomatoSound);

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./grape.png";
    plant.addEventListener("click", playGrapesSound);

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    totalAttempts++;
    if (this == currMoleTile && target === "टमाटर") {
        score += 10;
        correctAttempts++;
    } else if (this == currPlantTile && target === "grapes") {
        score += 10;
        correctAttempts++;
    }
    updateScore();
    updateTargetHeading();
}
function endGame() {
    gameOver = true;
    clearInterval(timerInterval);
    let accuracy = (correctAttempts / totalAttempts) * 100;
    document.getElementById("score").innerText = "SCORE: " + score.toString();
    document.getElementById("accuracy").innerText = "ACCURACY: " + accuracy.toFixed(2) + "%";
    let message = getMessage(score);
    displayResultModal(accuracy, score, message);

    // Retrieve existing game sessions from local storage
    let gameSessions = JSON.parse(localStorage.getItem('gameSessions')) || [];

    // Add current game session to the array
    const timestamp = new Date().toISOString();
    gameSessions.push({ accuracy: accuracy.toFixed(2), score: score, timestamp: timestamp });

    // Store the updated game sessions back in local storage
    localStorage.setItem('gameSessions', JSON.stringify(gameSessions));

    // Redirect to result.html page after 5 seconds
    setTimeout(redirectToResultPage, 5000);
}

function viewResult() {
    // Redirect to result.html page
    window.location.href = 'result.html';
}




function redirectToResultPage() {
    // Redirect to result.html page
    window.location.href = 'result.html';
}





function displayResultModal(accuracy, score, message) {
    let modal = document.getElementById("result-modal");
    let modalContent = document.getElementById("modal-content");
    modal.style.display = "block";
    modalContent.innerHTML = "Your accuracy: " + accuracy.toFixed(2) + "%" + "<br>" + 
                              "Your score: " + score + "<br>" +
                              "Message: " + message;
    
    // Automatically close the modal after 5 seconds
    setTimeout(closeModal, 5000);
}

function getMessage(score) {
    if (score >= 80) {
        return "Great job! You're a whack-a-mole master!";
    } else if (score >= 60) {
        return "Well done! You're getting good at this!";
    } else if (score >= 40) {
        return "Not bad! Keep practicing to improve!";
    } else {
        return "Keep trying! You'll get better with practice!";
    }
}



function closeModal() {
    let modal = document.getElementById("result-modal");
    modal.style.display = "none";
}

function playTomatoSound() {
    tomatoSound.play();
}

function playGrapesSound() {
    grapesSound.play();
}

function updateTargetHeading() {
    // Randomly select between "टमाटर" and "grapes" as the target
    target = Math.random() < 0.5 ? "टमाटर" : "grapes";
    let heading = document.getElementById("target-heading");
    heading.innerText = target + " को चुनो";
}

function updateScore() {
    document.getElementById("score").innerText = score.toString();
}

const readline = require('readline-sync');

runGame();
function initState(n, m, k) {
    var state = {};
    state.stepNumber = 0;
    state.colors = new Array(n).fill(m);
    state.size = k;
    state.finalState = chooseRandom(state);
    state.currentState = null;
    return state;
}
function getWinner(state) {
    if(state.stepNumber > state.colors.length * 2)
        return "Mastermind wins";
    else if(isCorrectFinalState(state))
        return "Player wins";
    return false;
}

function isCorrectFinalState(state) {
    return getCurrentMatch(state) == state.finalState.length;
}

function chooseRandom(state) {
    var colorsCopy = [...state.colors];
    var chosenColors = [];
    while(chosenColors.length < state.size) {
        var randomColor = getRandomInt(state.colors.length);
        if(colorsCopy[randomColor] > 0) {
            colorsCopy[randomColor]--;
            chosenColors.push(randomColor);
        }
    }
    return chosenColors;
}

function getCurrentMatch(state) {
    var clonedFinalState = [...state.finalState];
    var score = 0;
    if(state.currentState) {
        for(var choice of state.currentState) {
            if(clonedFinalState.indexOf(choice) != -1) {
                score++;
                clonedFinalState.splice(clonedFinalState.indexOf(choice), 1);
            }
        }
    }
    return score;

}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function runGame() {
    var startState = initState(8, 2, 3);

    console.log(startState);
    console.log("You have to guess 3 different colors, out of 8 possible colors, each of them possibly repeating 1 times maximum");
    while(true) {
        var guess = readline.question("Please input the sequence of 3 numbers from 0 to 7, comma separated \n");
        var parsedGuess = null;
        try{
            var parsedGuess = guess.split(',').map(Number);
            if(parsedGuess.length != 3) {
                throw 'Please type 3 elements, not ' + parsedGuess.length;
            }
            for(var guessColor of parsedGuess) {
                if(isNaN(guessColor))
                    throw 'All of the colors are supposed to be numbers';
                if(guessColor > startState.colors.length || guessColor < 0)
                    throw `Guesses are between 0 and ${startState.colors.length - 1}`;
            }
        }catch(ex) {
            console.log(ex);
            continue;
        }
        startState.currentState = parsedGuess;

        var winner = getWinner(startState);
        if(winner !== false) {
            console.log(winner);
            return;
        }else {
            console.log(`You guessed ${getCurrentMatch(startState)} out of 3 correctly, you have ${Math.pow(startState.colors.length, 2) - startState.stepNumber} gueses left`);
        }
        
        startState.stepNumber++;
    }

}

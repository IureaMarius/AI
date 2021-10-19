var PriorityQueue = require('priorityqueuejs');
const readline = require('readline-sync');
function init(n) {
    var problem = {}; 
    // People[0][i] is married to People[1][i], the value of it is either 0 or 1, representing which side they are on
    problem.People = [];
    problem.People.push(new Array(n).fill(0));
    problem.People.push(new Array(n).fill(0));
    problem.BoatSide = false;
    return problem;
}


function checkFinal(state) {
    for(var husband of state.People[0]) {
        if(husband != 1)
            return false;
    }
    for(var wife of state.People[1]) {
        if(wife != 1)
            return false;
    }
    if(!state.BoatSide) 
        return false;
    return true;
}

// Checks if  the transition is possible


function cloneState(state) {
    var newState = init(state.People[0].length);
    newState.BoatSide = state.BoatSide;
    for(var personType in newState.People) {
        for(var i = 0; i < newState.People[personType].length; i++) {
            newState.People[personType][i] = state.People[personType][i];
        }
    }
    return newState;
}
function transitionPossible(state, action) {
    if(action.length < 1 || action.length > 2)
        return false;
    // people on the same side as boat
    for(var person of action) {
        if(state.People[person[0]][person[1]] != state.BoatSide)
            return false;
    }
    

    // peform the action
    var newState = cloneState(state);
    for(var person in action) {
        newState.People[person[0]][person[1]] = state.BoatSide ? 0 : 1;
    }
    newState.BoatSide = state.BoatSide ? 0 : 1;

    //check if the rule is followed

    for(var i = 0; i < newState.People[0].length; i++) {
        // are on different shores
        if(newState.People[0][i] != newState.People[1][i]) {
            // if there's any man on the same side as the woman
            for(var manSide of newState.People[0]) {
                if(manSide == newState.People[1][i])
                    return false;
            }
        }
    }

    return true;
}
function Transition(state, action) {

    for(var person of action) {
        state.People[person[0]][person[1]] = state.BoatSide ? 0 : 1;
    }
    state.BoatSide = state.BoatSide ? 0 : 1;
}

var visitedStates = [];
function checkStateVisited(state) {
    for(var visitedState of visitedStates) {
        var areEqual = true;
        if(visitedState.BoatSide != state.BoatSide)
            continue;
        for(var personType in state.People) {
            for(var i = 0; i < state.People[personType].length; i++) {

                if(state.People[personType][i] != visitedState.People[personType][i]) {
                    areEqual = false;
                    break;
                }
            }
            if(!areEqual)
                break;
        }
        if(areEqual) {
            return true;
        }
    }
    return false;
}

var finalTransitionList = []

function bkt(state) {
    if(checkStateVisited(state)) {
        return false;
    }else {
        visitedStates.push(cloneState(state));
    }
    if(checkFinal(state)) {
        return true;
    }

    for(var i in state.People[0]) {
        for(var j in state.People[1]) {
            for(var nrOfPassengers = 1; nrOfPassengers <= 2; nrOfPassengers++) {
                for(var type = 0; type <= 1; type++) {
                    for(var sameType = 0; sameType <= 1; sameType++) {
                        var newAction = [];
                        newAction.push([type, i]);
                        if(nrOfPassengers > 1) {

                            if(sameType == 0)
                                newAction.push([type ? 0 : 1, j]);
                            else
                                newAction.push([type, j]);
                        }
                        if(transitionPossible(state, newAction)) {
                            Transition(state, newAction);
                            if(bkt(cloneState(state))) {
                                finalTransitionList.push(state);
                                return true;
                            }
                            Transition(state, newAction);
                        }
                    }
                }
            }
        }
    }
    
    return false;
}


function bfs(initialState) {
    var queue = [initialState];
    while(queue.length) {
        
        state = queue.shift();

        if(checkFinal(state)) {
            while(state != null) {
                console.log(state);
                state = state.ParentState;
            }
            return true;
        }

        if(checkStateVisited(state)) {
            continue;
        }else {
            visitedStates.push(cloneState(state));
        }

        for(var i in state.People[0]) {
            for(var j in state.People[1]) {
                for(var nrOfPassengers = 1; nrOfPassengers <= 2; nrOfPassengers++) {
                    for(var type = 0; type <= 1; type++) {
                        for(var sameType = 0; sameType <= 1; sameType++) {
                            var newAction = [];
                            newAction.push([type, i]);
                            if(nrOfPassengers > 1) {

                                if(sameType == 0)
                                    newAction.push([type ? 0 : 1, j]);
                                else
                                    newAction.push([type, j]);
                            }
                            if(transitionPossible(state, newAction)) {
                                var clonedState = cloneState(state);
                                Transition(clonedState, newAction);
                                clonedState.ParentState = state;
                                queue.push(clonedState);
                            }
                        }
                    }
                }
            }
        }
    }
    
    return false;
}

function hillHeuristic(state) {
    var result = 0;
    for(var personType in state.People) {
        for(var side of state.People[personType]) {
            result += side; 
        }
    }
    return result;
}

function hillClimbing(initialState) {
    var queue = new PriorityQueue((a, b) => {
        return hillHeuristic(a) - hillHeuristic(b);
    });
    queue.enq(initialState);
    while(queue.size()) {
        
        state = queue.deq();

        if(checkFinal(state)) {
            while(state != null) {
                console.log(state);
                state = state.ParentState;
            }
            return true;
        }

        if(checkStateVisited(state)) {
            continue;
        }else {
            visitedStates.push(cloneState(state));
        }

        for(var i in state.People[0]) {
            for(var j in state.People[1]) {
                for(var nrOfPassengers = 1; nrOfPassengers <= 2; nrOfPassengers++) {
                    for(var type = 0; type <= 1; type++) {
                        for(var sameType = 0; sameType <= 1; sameType++) {
                            var newAction = [];
                            newAction.push([type, i]);
                            if(nrOfPassengers > 1) {

                                if(sameType == 0)
                                    newAction.push([type ? 0 : 1, j]);
                                else
                                    newAction.push([type, j]);
                            }
                            if(transitionPossible(state, newAction)) {
                                var clonedState = cloneState(state);
                                Transition(clonedState, newAction);
                                clonedState.ParentState = state;
                                if(hillHeuristic(clonedState) > hillHeuristic(state))
                                    queue.enq(clonedState);
                            }
                        }
                    }
                }
            }
        }
    }
    
    while(state != null) {
        console.log(state);
        state = state.ParentState;
    }
    return false;
}

function starHeuristic(state) {
    var result = state.StepNumber;
    for(var personType in state.People) {
        for(var side of state.People[personType]) {
            result += side; 
        }
    }
    return result;
}

function aStar(initialState) {
    var queue = new PriorityQueue((a, b) => {
        return starHeuristic(a) - starHeuristic(b);
    });
    initialState.StepNumber = 0;
    queue.enq(initialState);
    while(queue.size()) {
        
        state = queue.deq();

        if(checkFinal(state)) {
            while(state != null) {
                console.log(state);
                state = state.ParentState;
            }
            return true;
        }

        if(checkStateVisited(state)) {
            continue;
        }else {
            visitedStates.push(cloneState(state));
        }

        for(var i in state.People[0]) {
            for(var j in state.People[1]) {
                for(var nrOfPassengers = 1; nrOfPassengers <= 2; nrOfPassengers++) {
                    for(var type = 0; type <= 1; type++) {
                        for(var sameType = 0; sameType <= 1; sameType++) {
                            var newAction = [];
                            newAction.push([type, i]);
                            if(nrOfPassengers > 1) {

                                if(sameType == 0)
                                    newAction.push([type ? 0 : 1, j]);
                                else
                                    newAction.push([type, j]);
                            }
                            if(transitionPossible(state, newAction)) {
                                var clonedState = cloneState(state);
                                Transition(clonedState, newAction);
                                clonedState.ParentState = state;
                                clonedState.StepNumber = state.StepNumber + 1;
                                queue.enq(clonedState);
                            }
                        }
                    }
                }
            }
        }
    }
    
    while(state != null) {
        console.log(state);
        state = state.ParentState;
    }
    return false;
}


var endApplication = false;
while(!endApplication) {
    var state = init(3);
    console.log('Available algorithms:');
    console.log('bkt - Backtracking');
    console.log('bfs - Breadth First Search');
    console.log('hill - Hill Climbing');
    console.log('A* - A*');
    let command = readline.question('What algorithm should we use? Write exit in order to exit \n');
    finalTransitionList = [];
    visitedStates = [];
    

    switch(command) {
        case 'exit': 
            endApplication = true;
            break;
        case 'bkt': 
            console.log("there exists a solution: " + bkt(state));
            console.log(JSON.stringify(finalTransitionList, 2, 4));
            break;
        case 'bfs': 
            console.log("there exists a solution: " + bfs(state));
            break;
        case 'hill': 
            console.log("there exists a solution: " + hillClimbing(state));
            break;
        case 'A*': 
            console.log("there exists a solution: " + aStar(state));
            break;
        default:
            console.log('invalid command');
            break;

    }

}








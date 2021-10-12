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



var state = init(3);

console.log("there exists a solution: " + bfs(state));
console.log(JSON.stringify(finalTransitionList, 2, 4));







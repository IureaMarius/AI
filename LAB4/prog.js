// T - 0
// WA - 1
// NT - 2
// SA - 3 
// Q - 4
// NSW - 5
// V - 6


// adjacency list built from problem statement, used numbers instead of strings
var adjacency = [];
adjacency.push([6]);
adjacency.push([2, 3]);
adjacency.push([1, 4, 3]);
adjacency.push([1, 2, 4, 5, 6]);
adjacency.push([2, 3, 5]);
adjacency.push([4, 3, 6]);
adjacency.push([3, 5, 0]);

// set colors for all regions
colors = [];
colors.push(['R', 'B', 'G']); // T
colors.push(['R', 'B', 'G']); // WA
colors.push(['R', 'B', 'G']); //NT
colors.push(['R', 'B', 'G']); //SA
colors.push(['R', 'B', 'G']); // Q
colors.push(['R', 'B', 'G']); //NSW
colors.push(['R', 'B', 'G']); // V

solve(adjacency, colors);
function solve(adjList, colors) {
    var state = {};
    state.nodes = adjList;
    state.colors = colors;
    state.selectedColors = {};
    for(var index in state.nodes) {
        state.selectedColors[index] = null;
    }

    var nodeIndexes = [...Array(state.nodes.length).keys()]; 
    nodeIndexes.sort((x, y) => state.colors[x].length - state.colors[y].length);

    for(var color of state.colors[nodeIndexes[0]]) {
        var copy = JSON.parse(JSON.stringify(state));
        if(forwardCheck(copy, nodeIndexes[0], color)) {
            console.log('solution exists');
            break;
        }

    }



}
// What defines as tate is the available colors for all nodes, and the ednges between al of the nodes.

function forwardCheck(state, currentNode, selectedColor) {
    state.selectedColors[currentNode] = selectedColor;
    for(var neighbour of state.nodes[currentNode]) {
        if(state.colors[neighbour].indexOf(selectedColor) != -1) {
            state.colors[neighbour] = state.colors[neighbour].filter(x => x != selectedColor);
        }
    }
    if(noSolution(state)) {
        return false;
    }
    if(isSolution(state)) {
        console.log(state.selectedColors);
        return true;
    }

    var MRVNeighbours = MRV(state, currentNode);
    for(var neighbour of MRVNeighbours) {
        for(var color of state.colors[neighbour]) {
            if(state.selectedColors[neighbour] == null) {
                var copy = null;
                try {
                    copy = JSON.parse(JSON.stringify(state));
                }catch(ex) {
                    console.log(ex);
                }
                if(forwardCheck(copy, neighbour, color))
                    return true;
            }

        }
    }
    return false;
    
}
function MRV(state, currentNode) {
    var neighbours = [...Array(state.nodes.length).keys()]; 
    neighbours.sort((x, y) => state.colors[x].length - state.colors[y].length);
    return neighbours;
}
function noSolution(state) {
    for(var nodeIndex in state.colors) {
        if(state.colors[nodeIndex].length == 0 && state.selectedColors[nodeIndex] == null)
            return true;
    }
    return false;
}
function isSolution(state) {
    for(var nodeIndex in state.nodes) {
        if(state.selectedColors[nodeIndex] == null)
            return false;
    }
    return true;
}

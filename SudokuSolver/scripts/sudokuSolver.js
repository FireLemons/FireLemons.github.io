function Box(value){
    this.color = 'black';
    this.domain = Number.isInteger(value) ? [value] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.value = value;
}

var counter = 1;

function Puzzle(values){
    
    this.board;
    this.heuristicMatrix;
    this.undoStack = [];
    
    this.clear = function(){
        this.board = Array.apply(null, Array(9)).map(function(){
            return Array.apply(null, Array(9)).map(function(){
                return new Box();
            });
        });
    }
    
    //return the coordinates to the next variable to be set 
    //by first applying Minimum Remaining Values heuristic
    //and in the event of a tie, Degree heuristic
    this.getNext = function(){
        var heuristicMatrix = this.heuristicMatrix,
            maxDegree = 0,
            minRemainingValues = 16,
            next;
        
        this.board.forEach(function(row, i){
            row.forEach(function(box, j){
                var remainingValueCount = box.domain.length;
                var degree = heuristicMatrix[i][j];
                
                if(!box.value){
                    //variable with fewer remaining values was found
                    if(remainingValueCount < minRemainingValues){
                        maxDegree = degree;
                        minRemainingValues = remainingValueCount;
                        next = [i, j];
                    //tie break using degree heuristic if variable with equal remaining values was found
                    } else if(remainingValueCount == minRemainingValues && degree > maxDegree){
                        maxDegree = degree;
                        next = [i, j];
                    }
                }
            });
        });

        return next;
    }
    
    //like a constructor for Puzzle object
    this.init = function(){
        //init board
        if(values){ 
            this.board = values.map(function(row){
                return row.map(function(value){
                    return (value) ? new Box(value) : new Box();
                });
            })
        } else {
            this.clear();
        }
        
        //init heuristic matrix
        
        //Make 2D array of 0s.
        this.heuristicMatrix = Array.apply(null, Array(9)).map(function(){
            return Array.apply(null, Array(9));
        });

        //make arrays to keep track of count of unset variables in rows and columns
        var rows = Array.apply(null, Array(9)).map(Number.prototype.valueOf, 0),
            columns = Array.apply(null, Array(9)).map(Number.prototype.valueOf, 0);

        //find count of unset variables for each row and column
        this.board.forEach(function(row, i){
            row.forEach(function(box, j){
                if(box.value == undefined){
                    rows[i]++;
                    columns[j]++;
                }
            });
        });
        
        var board = this.board,
            heuristicMatrix = this.heuristicMatrix;
        
        //calcluate degree heuristic + 1 for each unset variable
        this.board.forEach(function(row, i){
            row.forEach(function(box, j){
                //if variable is unset calculate the heuristic
                if(!box.value){
                    //add count of constraining variables in rows and columns
                    heuristicMatrix[i][j] = rows[i] + columns[j];

                    //check if remaining constrained boxes have been set
                    forEachSubGridConstrainedCoordinates(i, j, function(coordinates){
                        heuristicMatrix[i][j] += board[coordinates[0]][coordinates[1]].value == undefined;
                    });
                }else{
                    heuristicMatrix[i][j] = NaN;
                }
            });
        });
    }
    
    this.init();
}

angular.module('SudokuSolver', []).controller('SudokuPuzzleController', function($interval, $timeout) {

    this.isSolving = false;
	this.failure = false;
	this.puzzle = new Puzzle([[NaN, NaN, 5,   NaN, 1,   NaN, NaN, NaN, NaN],
                              [NaN, NaN, 2,   NaN, NaN, 4,   NaN, 3,   NaN],
                              [1,   NaN, 9,   NaN, NaN, NaN, 2,   NaN, 6  ],
                              [2,   NaN, NaN, NaN, 3,   NaN, NaN, NaN, NaN],
                              [NaN, 4,   NaN, NaN, NaN, NaN, 7,   NaN, NaN],
                              [5,   NaN, NaN, NaN, NaN, 7,   NaN, NaN, 1  ],
                              [NaN, NaN, NaN, 6,   NaN, 3,   NaN, NaN, NaN],
                              [NaN, 6,   NaN, 1,   NaN, NaN, NaN, NaN, NaN],
                              [NaN, NaN, NaN, NaN, 7,   NaN, NaN, 5,   NaN]]);
	this.time = 0;//value for timing execution of program in ms
    
	this.interval = undefined;//performs steps to solve the puzzle and updates the timer
	this.timeout = undefined;//cancels solving if it takes too long
    
    this.resetPuzzle = function(scope){
        scope.puzzle.clear();
        
        scope.isSolving = false;
        scope.failure = false;
        scope.time = 0;
        
        $interval.cancel(scope.interval);
        $timeout.cancel(scope.timeout);
        
        scope.interval = undefined;
        scope.timeout = undefined;
    }

	this.hideError = function(){
		this.failure = false;
	}

	//handles "Solve" button press
	this.solvePuzzle = function(){
		if(this.interval === undefined){
			var outer = this;
            outer.isSolving = true;
            
			var startTime = new Date();
            
			var undoStack = [];
			var degreeHeuristics = this.puzzle.heuristicMatrix;
            
            //initial pass to prune domains using set boxes
			this.puzzle.board.forEach(function(elem, i){
				elem.forEach(function(box, j){
					if(box.value){//if the box has been set
						forwardCheck(i, j, box.value, outer.puzzle.board);
					}
				});
			});
            
            this.interval = $interval(function(){
				outer.time = new Date() - startTime;//update the timer

				var next = outer.puzzle.getNext();
                
				if(!next){//if a box to be set could not be found
					//stop
                    outer.isSolving = false;
					$interval.cancel(outer.interval);
					$timeout.cancel(outer.timeout);
					return;
				}else if(!outer.puzzle.board[next[0]][next[1]].domain.length){//if an empty domain is found
					//backtrack
					if(!undo(outer.puzzle.board, undoStack, degreeHeuristics)){//if puzzle is unsolvable
						//stop
						outer.failure = true;
						$interval.cancel(outer.interval);
						$timeout.cancel(outer.timeout);
						return;
					}
				}
				
				set(next[0], next[1], outer.puzzle.board, degreeHeuristics, undoStack);//set the next variable
			}, 1);

			//stop after 5 min
			this.timeout = $timeout(function(){
                outer.resetPuzzle(outer);
            }, 120000);
		}
	}
});

//set a variable
function set(i, j, puzzle, heuristicMatrix, undoStack){
	
	var box = puzzle[i][j];
    
	//error check
	if(box.value){//already set
		return;
	} else if(box.domain.length == 0){//no domain
		return;
	}

	//update degree heuristic
	forEachConstrained(i, j, function(coordinates){
		heuristicMatrix[coordinates[0]][coordinates[1]]--;
	});
    
	//forward check and store results
	var diff = forwardCheck(i, j, box.domain[0], puzzle);
    
	undoStack.push({
		isLast: box.domain.length == 1 || box.domain[0] > box.domain[1],//whether the box set just exhausted its domain by completing a circular shift right
		//the coordinates of the variable set
		i: i,
		j: j,
		domain: box.domain,//the domain of the variable before it is set
		constrained: diff
	});
    
    box.value = box.domain[0];
}

//undo setting a box
function undo(puzzle, undoStack, heuristicMatrix){
	var action = undoStack.pop();

	while(action){
		//circular shift right the domain of box that was set
        var centeralBox = puzzle[action.i][action.j];
        
		centeralBox.domain = action.domain.slice(1);
		centeralBox.domain.push(action.domain[0]);
        
        centeralBox.value = undefined;

		//restore the pruned domains of the boxes related to box that was set
		action.constrained.forEach(function(elem){
            var box = puzzle[elem.loc[0]][elem.loc[1]];
            
			box.domain.splice(elem.pos, 0, action.domain[0]);
		});

		//restore heuristic data structure
		forEachConstrained(action.i, action.j, function(elem){
			heuristicMatrix[elem[0]][elem[1]]++;
		});
        
		if(action.isLast){//if domain is exhausted
			action = undoStack.pop();//undo again
			if(!action){//a box could not be set
				return false;
			}
		}else{
			action = undefined;//stop undo operations
		}
	}
	return true;
}

//prunes the domains of all boxes contrained by box puzzle[i][j]
//returns a array describing the result of the pruning duing forward checking
function forwardCheck(i, j, boxValue, puzzle){
	var diff = [];

	forEachConstrained(i, j, function(coordinates){
        
		var box = puzzle[coordinates[0]][coordinates[1]];

		if(box.value){//if the box is set already
			return;//continue out of forEach
		}

		var index = box.domain.indexOf(boxValue);//index of value to be pruned in domain
        
		if(index >= 0){//if value was found in the domain
			box.domain.splice(index, 1);
            
			diff.push({//store the position of the variable and where in the array the domain was pruned
				loc: [coordinates[0], coordinates[1]],
				pos: index
			});
		}
	});

	return diff;
}

//perform actions for each box constrained by box puzzle[i][j]
function forEachConstrained(i, j, forEach){
	var coordinates = [];

	//vertically related variables
	for(var k = 0; k < i; k++){
		coordinates.push([k, j]);
	}

	for(var k = i + 1; k < 9; k++){
		coordinates.push([k, j]);
	}

	//horizontally related variables
	for(var l = 0; l < j; l++){
		coordinates.push([i, l]);
	}

	for(var l = j + 1; l < 9; l++){
		coordinates.push([i, l]);
	}
    
	coordinates.forEach(forEach);
    forEachSubGridConstrainedCoordinates(i, j, forEach);
}

//Gets coordinates of all boxes constrained by the box at i, j in the 3x3 subgrid 
//with the exception of coordinates of boxes sharing the same row or column 
//param i the index of the row of the box to get coordinates for
//param j the index of the column of the box to get coordinates for
//returns 4 coordinates of boxes constrained by the box at i, j and not sharing rows or columns with it
function forEachSubGridConstrainedCoordinates(i, j, forEach){
    var coordinates = [];
    
    var ix = 5 - (i % 3);
	var jx = 5 - (j % 3);
	var iSuper = Math.floor(i / 3) * 3;
	var jSuper = Math.floor(j / 3) * 3;
	var iSubCoord = [iSuper + ix - Math.floor(ix / 2) - 2, iSuper + Math.floor(ix / 2)];
	var jSubCoord = [jSuper + jx - Math.floor(jx / 2) - 2, jSuper + Math.floor(jx / 2)];
	
	coordinates.push([iSubCoord[0], jSubCoord[0]]);
	coordinates.push([iSubCoord[0], jSubCoord[1]]);
	coordinates.push([iSubCoord[1], jSubCoord[0]]);
	coordinates.push([iSubCoord[1], jSubCoord[1]]);
    
    coordinates.forEach(forEach);
}
function Box(value, color = 'blue'){
    this.color = color;
    this.conflicting = [];
    this.domain = Number.isInteger(value) ? [value] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.degreeHeuristic = undefined;
    this.value = value;
}

var counter = 1;

function Puzzle(){
    this.board;
    this.undoStack;
    
    //erases all values of boxes
    this.clear = function(){
        this.board.forEach(function(row){
            row.forEach(function(box){
                box.color = 'blue';
                box.domain = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                box.value = undefined;
            });
        });
    }
    
    //Gets coordinates of all boxes constrained by the box at i, j in the 3x3 subgrid 
    //with the exception of coordinates of boxes sharing the same row or column 
    //param i the index of the row of the box to get coordinates for
    //param j the index of the column of the box to get coordinates for
    //returns 4 coordinates of boxes constrained by the box at i, j and not sharing rows or columns with it
    this.getSubGridConstrained = function(i, j){
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
        
        return coordinates;
    }
    
    //perform actions for each box constrained by box puzzle[i][j]
    this.getConstrained = function(i, j){
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
        
        this.getSubGridConstrained(i, j).forEach(function(coords){
            coordinates.push(coords);
        });
        
        return coordinates;
    }
    
    //checks for conflicting values in the board for the box at i, j
    //
    //param i the column index of the box to check against other boxes
    //param j the column index of the box to check against other boxes
    //returns an array of boxes that conflict with the box at i, j
    this.checkBox = function(i, j){
        var board = this.board;
        
        board[i][j].color = 'black';
        
        this.getConstrained(i, j).forEach(function(coordinates){
            var box = board[coordinates[0]][coordinates[1]];
            
            if(box.value == board[i][j].value){
                board[i][j].color = 'red';
                box.color = 'red';
                board[i][j].conflicting.push(coordinates);
                box.conflicting.push(coordinates);
            } else if(box.color == 'red'){
                box.conflicting.splice(box.conflicting.indexOf(coordinates), 1);
                
                if(!box.conflicting.length){
                    box.color = 'black';
                    board[i][j].color = 'black';
                }
            }
        });
    }
    
    //prunes the domains of all boxes contrained by box puzzle[i][j]
    //
    //param i the row index of the box to be forward checked
    //param j the column index of the box to be forward
    //param boxValue the value of the box to forward check
    //returns a array describing the result of pruning box domains duing forward checking
    this.forwardCheck = function(i, j, boxValue){
        var diff = [];
            board = this.board;

        this.getConstrained(i, j).forEach(function(coordinates){
            
            var box = board[coordinates[0]][coordinates[1]];

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
    
    //Selects the coordinates of the next variable to be set 
    //by first applying Minimum Remaining Values heuristic
    //and in the event of a tie, Degree heuristic
    //
    //returns coordinates of the best box to be set accoring to some heuristics
    this.getNext = function(){
        var maxDegree = 0,
            minRemainingValues = 16,
            next;
        
        this.board.forEach(function(row, i){
            row.forEach(function(box, j){
                var remainingValueCount = box.domain.length;
                var degree = box.degreeHeuristic;
                
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
    
    //set the value of a box
    //
    //param i the row index of the box to be set
    //param j the column index of the box to be set
    this.set = function(i, j){
        
        var board = this.board,
            box = board[i][j];
        
        //error check
        if(box.value){//already set
            return;
        } else if(box.domain.length == 0){//no domain
            return;
        }

        //update degree heuristic
        this.getConstrained(i, j).forEach(function(coordinates){
            board[coordinates[0]][coordinates[1]].degreeHeuristic--;
        });
        
        //forward check and store results
        var diff = this.forwardCheck(i, j, box.domain[0]);
        
        this.undoStack.push({
            isLast: box.domain.length == 1 || box.domain[0] > box.domain[1],//whether the box set just exhausted its domain by completing a circular shift right
            //the coordinates of the box set
            i: i,
            j: j,
            domain: box.domain,//the domain of the box before it is set
            constrained: diff
        });
        
        box.value = box.domain[0];
    }

    //undo setting a box
    //
    //returns
    //   true if undo was successful
    //   false if undo was unsuccessful which indicates all attempts to solve the puzzle have been exhausted
    this.undo = function(){
        var action = this.undoStack.pop();

        while(action){
            //circular shift right the domain of box that was set
            var board = this.board,
                centeralBox = board[action.i][action.j],
                undoStack = this.undoStack;
            
            centeralBox.domain = action.domain.slice(1);
            centeralBox.domain.push(action.domain[0]);
            
            centeralBox.value = undefined;

            //restore the pruned domains of the boxes related to box that was set
            action.constrained.forEach(function(elem){
                var box = board[elem.loc[0]][elem.loc[1]];
                
                box.domain.splice(elem.pos, 0, action.domain[0]);
            });

            //restore heuristic data structure
            this.getConstrained(action.i, action.j).forEach(function(coordinates){
                board[coordinates[0]][coordinates[1]].degreeHeuristic++;
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
    
    //like a constructor for Puzzle object
    this.init = function(values){
        //init board
        if(values){
            this.board = values.map(function(row){
                return row.map(function(value){
                    return (value) ? new Box(value, 'black') : new Box();
                });
            })
        } else if(this.board){
            this.board.forEach(function(row){
                row.forEach(function(box){
                    if(box.value) {
                        box.color = 'black';
                    } else {
                        box.color  = 'blue';
                        box.domain = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    }
                });
            });
        } else {
            this.board = new Array(9).fill(new Array(9).fill(new Box()));
        }
        
        //init heuristic matrix
        //make arrays to keep track of count of unset variables in rows and columns
        var rows = new Array(9).fill(0),
            columns = new Array(9).fill(0);

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
            outer = this;
        
        //calcluate degree heuristic + 1 for each unset variable
        this.board.forEach(function(row, i){
            row.forEach(function(box, j){
                //if variable is unset calculate the heuristic
                if(!box.value){
                    //add count of constraining variables in rows and columns
                    board[i][j].degreeHeuristic = rows[i] + columns[j];

                    //check if remaining constrained boxes have been set
                    outer.getSubGridConstrained(i, j).forEach(function(coordinates){
                        board[i][j].degreeHeuristic += board[coordinates[0]][coordinates[1]].value == undefined;
                    });
                }else{
                    board[i][j].degreeHeuristic = NaN;
                }
            });
        });
        
        //init undoStack
        this.undoStack = [];
        
        //initial pass to prune domains using set boxes
        this.board.forEach(function(row, i){
            row.forEach(function(box, j){
                if(box.value){//if the box has been set
                    outer.forwardCheck(i, j, box.value);
                }
            });
        });
    }
}

angular.module('SudokuSolver', []).controller('SudokuPuzzleController', function($interval, $timeout) {

    this.isSolving = false;
	this.failure = false;
	this.puzzle = new Puzzle();
    this.puzzle.init([[NaN, NaN, 5,   NaN, 1,   NaN, NaN, NaN, NaN],
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

    this.stopSolve = function(){
        this.isSolving = false;
        $interval.cancel(this.interval);
        $timeout.cancel(this.timeout);
    }
    
    this.checkBox = function(i, j){
        var box = this.puzzle.board[i][j];

        if(box.value){
            this.puzzle.checkBox(i, j);
        } else {
            if(box.color != 'blue'){
                box.color = 'blue';
            }
        }
    }
    
    this.resetPuzzle = function(){
        this.puzzle.clear();
        
        this.isSolving = false;
        this.failure = false;
        this.time = 0;
        
        this.stopSolve();
        
        this.interval = undefined;
        this.timeout = undefined;
    }

	//handles "Solve" button press
	this.solvePuzzle = function(){
		if(!this.isSolving){
            this.isSolving = true;
			var outer = this,
                startTime = new Date();
            
            outer.puzzle.init();
            
            this.interval = $interval(function(){
				outer.time = new Date() - startTime;//update the timer

				var next = outer.puzzle.getNext();
                
				if(!next){//if a box to be set could not be found
					//stop
					outer.stopSolve();
					return;
				}else if(!outer.puzzle.board[next[0]][next[1]].domain.length){//if an empty domain is found
					//backtrack
					if(!outer.puzzle.undo()){//if puzzle is unsolvable
						//stop
						outer.failure = true;
                        outer.stopSolve();
						return;
					}
				}
				
				outer.puzzle.set(next[0], next[1]);//set the next variable
			}, 1);

			//stop after 5 min
			this.timeout = $timeout(function(){
                outer.failure = true;
                outer.stopSolve();
            }, 120000);
		}
	}
});
angular.module('SudokuSolver', []).controller('SudokuPuzzleController', function($interval, $timeout) {

	this.failure = false;
	this.puzzle = puzzles[0].slice(0);//the data structure holding the puzzle information
	this.time = 0;//value of timer of execution of program in ms
	//promises used mostly to run the function while updating the timer
	this.interval = undefined;
	this.timeout = undefined;


	//gets info to display values of board
	this.getBoardValue = function(i, j, k, l){
		var value = this.puzzle[i * 3 + k][j * 3 + l];

		return (Number.isInteger(value)) ? value : '0';
	}

	//hides domain values from showing up on the board
	this.getBoardVisibility = function(i, j, k, l){
		return (this.getBoardValue(i, j, k, l) === '0') ? 'invisible' : '';
	}

	this.hideError = function(){
		this.failure = false;
	}

	//handles "Solve" button press
	this.solvePuzzle = function(){
		if(this.interval === undefined){
			var outer = this;
			var startTime = new Date();

			var undoStack = [];
			var degreeHeuristics = getDegreeHeuristics(this.puzzle);

			this.puzzle.forEach(function(elem, i){
				elem.forEach(function(elemInner, j){
					if(Number.isInteger(elemInner)){
						forwardCheck(i, j, elemInner, outer.puzzle);
					}
				});
			});

			this.interval = $interval(function(){
				outer.time = new Date() - startTime;//update the timer

				var next = getNext(outer.puzzle, degreeHeuristics);

				if(!next.length){//if a variable to set could not be found
					//stop
					$interval.cancel(outer.interval);
					$timeout.cancel(outer.timeout);
					return;
				}else if(!outer.puzzle[next[0]][next[1]].length){//if an empty domain is found
					//backtrack
					if(!undo(outer.puzzle, undoStack, degreeHeuristics)){//if puzzle is unsolvable
						//stop
						outer.failure = true;
						$interval.cancel(outer.interval);
						$timeout.cancel(outer.timeout);
						return;
					}
				}
				
				set(next[0], next[1], outer.puzzle, degreeHeuristics, undoStack);//set the next variable
			}, 1);

			//stop after 5 min
			this.timeout = $timeout(function(){
				outer.time = new Date() - startTime;//update the timer
				$interval.cancel(outer.promise);
				outer.interval = undefined;
			}, 3000000);
		}
	}
});

//returns a matrix of the value of the heuristic for each unset variable 
function getDegreeHeuristics(puzzle){
	//Make 2D array of 0s.
	var result = Array.apply(null, Array(puzzle.length)).map(function(){
		return Array.apply(null, Array(puzzle[0].length));
	});

	//make arrays to keep track of count of unset variables in rows and columns
	var rows = Array.apply(null, Array(puzzle.length)).map(Number.prototype.valueOf, 0);
	var columns = Array.apply(null, Array(puzzle[0].length)).map(Number.prototype.valueOf, 0);

	//find count of unset variables for each row and column
	puzzle.forEach(function(elem, i){
		elem.forEach(function(innerElem, j){
			if(puzzle[i][j].length > 1){
				rows[i]++;
				columns[j]++;
			}
		});
	});

	//calcluate heuristic + 1 for each unset variable
	puzzle.forEach(function(elem, i){
		elem.forEach(function(innerElem, j){
			//if variable is unset calculate the heuristic
			if(!Number.isInteger(innerElem) && innerElem.length > 1){
				//add count of constraining variables in rows and columns
				result[i][j] = rows[i] + columns[j];

				//check for constraining variables in 3x3 subgrid
				var ix = 5 - (i % 3);
				var jx = 5 - (j % 3);
				var iSuper = Math.floor(i / 3) * 3;
				var jSuper = Math.floor(j / 3) * 3;

				result[i][j] += Array.isArray(puzzle[iSuper + ix - Math.floor(ix / 2) - 2][jSuper + jx - Math.floor(jx / 2) - 2]);
				result[i][j] +=	Array.isArray(puzzle[iSuper + Math.floor(ix / 2)][jSuper + Math.floor(jx / 2)]);
				result[i][j] +=	Array.isArray(puzzle[iSuper + ix - Math.floor(ix / 2) - 2][jSuper + Math.floor(jx / 2)]);
				result[i][j] +=	Array.isArray(puzzle[iSuper + Math.floor(ix / 2)][jSuper + jx - Math.floor(jx / 2) - 2]);
			}else{
				result[i][j] = NaN;
			}
		});
	});

	return result;
}

//return the coordinates to the next variable to be set 
//by first applying MRV heuristic
//and in the event of a tie, Degree heuristic
function getNext(puzzle, heuristicMatrix){
	var next = [];
	var min = 16;

	for(var i = 0; i < puzzle.length; i++){
		for(var j = 0; j < puzzle.length; j++){
			if(!Number.isInteger(puzzle[i][j]) && puzzle[i][j].length < min){//variable with fewer remaining values was found
				min = puzzle[i][j].length;
				next = [i, j];
			} else if(puzzle[i][j].length > 1 && puzzle[i][j].length == min){//variable with equal remaining values was found
				next = (heuristicMatrix[i][j] > heuristicMatrix[next[0]][next[1]]) ? [i, j] : next;//tie break using degree heuristic
			}
		}
	}

	return next;
}

//set a variable
function set(i, j, puzzle, heuristicMatrix, undoStack){
	
	var domain = puzzle[i][j];

	//error check
	if(Number.isInteger(domain)){//already set
		console.log("Number already set.");
		return;
	} else if(domain.length == 0){//no domain
		console.log("Empty domain cannot be set.");
		return;
	}

	//update degree heuristic
	getConstrained(i, j, function(elem){
		heuristicMatrix[elem[0]][elem[1]]--;
	});

	//forward check and store results
	var diff = forwardCheck(i, j, domain[0], puzzle);

	undoStack.push({
		isLast: domain.length == 1 || domain[0] > domain[1],//whether the variable set just exhausted its domain by completing a circular shit right cycle
		//the coordinates of the variable set
		i: i,
		j: j,
		domain: domain,//the domain of the variable before it is set
		constrained: diff
	});

	puzzle[i][j] = domain[0];
}

//undo setting a variable
function undo(puzzle, undoStack, heuristicMatrix){
	var action = undoStack.pop();

	while(action){
		//circular shift right the domain of variable that was set
		puzzle[action.i][action.j] = action.domain.slice(1);
		puzzle[action.i][action.j].push(action.domain[0]);

		//restore the pruned domains of the vairables related to variable that was set
		action.constrained.forEach(function(elem){
			puzzle[elem.loc[0]][elem.loc[1]].splice(elem.pos, 0, action.domain[0]);
		});

		//restore huerisitc data structure
		getConstrained(action.i, action.j, function(elem){
			heuristicMatrix[elem[0]][elem[1]]++;
		});

		if(action.isLast){//if domain is exhausted
			action = undoStack.pop();//undo again
			if(!action){//a variable could ne be set
				return false;
			}
		}else{
			action = undefined;//stop undo operations
		}
	}
	return true;
}

//prunes the domains of a variable
//returns a array describing the result of the pruning
function forwardCheck(i, j, value, puzzle){
	var diff = [];

	getConstrained(i, j, function(elem){
		var variable = puzzle[elem[0]][elem[1]];

		if(Number.isInteger(variable)){//if the variable is set already
			return;//continue out of forEach
		}

		var index = variable.indexOf(value);//index of value in domain

		if(index >= 0){//if domain was pruned
			variable.splice(index, 1);
			diff.push({//store the position of the variable and where in the array the domain was pruned
				loc: [elem[0], elem[1]],
				pos: index
			});
		}
	});

	return diff;
}

//get a list of coordinates of variables related to the variable at puzzle[i][j] by constraints and perform actions for each element
function getConstrained(i, j, forEach){
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

	//the 3x3 subGrid
	var ix = 5 - (i % 3);
	var jx = 5 - (j % 3);
	var iSuper = Math.floor(i / 3) * 3;
	var jSuper = Math.floor(j / 3) * 3;
	var iSubCoord = [iSuper + ix - Math.floor(ix / 2) - 2, iSuper + Math.floor(ix / 2)];
	var jSubCoord = [jSuper + jx - Math.floor(jx / 2) - 2, jSuper + Math.floor(jx / 2)];
	
	coordinates.push([iSubCoord[0], jSubCoord[0]]);
	coordinates.push([iSubCoord[1], jSubCoord[0]]);
	coordinates.push([iSubCoord[0], jSubCoord[1]]);
	coordinates.push([iSubCoord[1], jSubCoord[1]]);

	coordinates.forEach(forEach);
}

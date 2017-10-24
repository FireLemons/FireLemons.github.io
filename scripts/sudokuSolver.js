angular.module('SudokuSolver', []).controller('SudokuPuzzleController', function() {

	this.instances = ['A', 'B', 'C'];
	this.puzzleInstance = 'A';
	this.puzzle = puzzles[0].slice(0);;

	this.loadPuzzle = function(instance){
		this.puzzle = puzzles[instance].slice(0);
		this.puzzleInstance = this.instances[instance];

		console.log(this.puzzle);
	}

	this.getBoardValue = function(i, j, k, l){
		var value = this.puzzle[i * 3 + k][j * 3 + l];

		return (value.length > 1) ? '0': value[0];
	}

	this.getBoardVisibility = function(i, j, k, l){
		return (this.getBoardValue(i, j, k, l) === '0') ? 'invisible' : '';
	}
});

function getNextMRV(puzzle){
	var next = [];
	var min = 16;

	for(var i = 0; i < puzzle.length; i++){
		for(var j = 0; j < puzzle.length; j++){
			if(puzzle[i][j].length > 1 && puzzle[i][j].length < min){
				min = puzzle[i][j].length;
				next = [i, j];
			}
		}
	}

	return next;
}

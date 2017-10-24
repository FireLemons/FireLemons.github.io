angular.module('SudokuSolver', []).controller('SudokuPuzzleController', function() {

	this.instances = ["A", "B", "C"];
	this.puzzleInstance = "A";
	this.puzzle = puzzles[0].slice(0);;

	this.loadPuzzle = function(instance){
		this.puzzle = puzzles[instance].slice(0);
		this.puzzleInstance = this.instances[instance];
	}

	this.getBoardValue = function(i, j, k, l){
		var value = this.puzzle[i * 3 + k][j * 3 + l];

		return (value.length == 1) ? value[0] : '';
	}
});

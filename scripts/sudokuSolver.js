angular.module('SudokuSolver', []).controller('SudokuPuzzleController', function() {

	this.instances = ["A", "B", "C"];
	this.puzzleInstance = "A";
	this.puzzle=puzzles[0];

	this.loadPuzzle = function(instance){
		this.puzzle = puzzles[instance];
		this.puzzleInstance = this.instances[instance];
	}
});

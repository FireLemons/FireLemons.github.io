describe('Check if testing is enabled', function(){
    it('should be enabled', function(){
        expect(testing).toBeDefined();
        expect(testing).toBe(true);
    });
});

describe('Initializing the puzzle', function(){
    var sudokuPuzzleService;
    
    beforeEach(module('SudokuSolver'));
    beforeEach(inject(function(_sudokuPuzzle_){
        sudokuPuzzleService = _sudokuPuzzle_;
    }));
    
    it('makes a 2d matrix of Box objects on first initialization with no args', function(){
        sudokuPuzzleService.init();
        
        var newBox = new Box();
        newBox.degreeHeuristic = 22;
        
        sudokuPuzzleService.board.forEach(function(row){
            row.forEach(function(box){ 
                expect(box).toEqual(newBox);
            })
        });
    });
});
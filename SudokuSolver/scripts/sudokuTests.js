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
        console.log(sudokuPuzzleService);
    }));
    
    it('', function(){
        expect(true).toEqual(true);
    });
});
describe('Check if testing is enabled', function(){
    it('should be enabled', function(){
        expect(testing).toBeDefined();
        expect(testing).toBe(true);
    });
});

var sudokuPuzzleService;

beforeEach(module('SudokuSolver'));
beforeEach(inject(function(_sudokuPuzzle_){
    sudokuPuzzleService = _sudokuPuzzle_;
}));

afterEach(function(){
    sudokuPuzzleService = undefined;
});

describe('Initializing the puzzle object', function(){
    
    it('makes a 2D 9x9 matrix of Box objects on initialization with no args', function(){
        sudokuPuzzleService.init();
        
        expect(sudokuPuzzleService.board.length).toBe(9);
        
        sudokuPuzzleService.board.forEach(function(row){
            
            expect(row.length).toBe(9);
            
            row.forEach(function(box){ 
                expect(box instanceof Box).toBe(true);
            })
        });
    });
});
describe('Check if testing is enabled', function(){
    it('should be enabled', function(){
        expect(testing).toBeDefined();
        expect(testing).toBe(true);
    });
});

describe('The sudoku puzzle service', function(){
    var sudokuPuzzleService;

    beforeEach(module('SudokuSolver'));
    beforeEach(inject(function(_sudokuPuzzle_){
        sudokuPuzzleService = _sudokuPuzzle_;
    }));

    describe('The getSubGridConstrained function', function(){
        it('returns a set of 4 coordiantes given coordinates to a box on the board', function(){
            for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                    expect(sudokuPuzzleService.getSubGridConstrained(i, j).length).toBe(4);
                }
            }
        });
        
        it('doesn\'t return a set of coordinates interstecting with parameters row i or column j', function(){
            for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                    var coordinates = sudokuPuzzleService.getSubGridConstrained(i, j),
                        columnIndicies = coordinates.map(function(coords){
                            return coords[1];
                        }),
                        rowIndicies = coordinates.map(function(coords){
                            return coords[0];
                        });
                    
                    expect(rowIndicies).not.toContain(i);
                    expect(columnIndicies).not.toContain(j);
                }
            }
        });
    });

    describe('The getConstrined function', function(){
        
    });

    describe('The heuristic function', function(){
        
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
});
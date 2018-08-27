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
        beforeEach(function(){
           sudokuPuzzleService.init(); 
        });
        
        it('returns a set of 4 boxes given coordinates to a box on the board', function(){
            for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                    var boxes = sudokuPuzzleService.getSubGridConstrained(i, j);
                    
                    expect(boxes.length).toBe(4);
                    boxes.forEach(function(box){
                        expect(box instanceof Box).toBe(true);
                    });
                }
            }
        });
        
        it('doesn\'t return a set of boxes interstecting with parameters row i or column j', function(){
            var board = sudokuPuzzleService.board;
            
            for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                    var boxes = sudokuPuzzleService.getSubGridConstrained(i, j),
                        iSubGridStartIndex = Math.floor(i / 3) * 3;
                        jSubGridStartIndex = Math.floor(j / 3) * 3;
                    
                    for(var k = iSubGridStartIndex; k < iSubGridStartIndex + 3; k++){
                        expect(boxes.includes(board[k][j])).toBe(false);
                    }
                    
                    for(var l = jSubGridStartIndex; l < jSubGridStartIndex + 3; l++){
                        expect(boxes.includes(board[i][l])).toBe(false);
                    }
                }
            }
        });
        
        it('returns a set of boxes within the 3x3 subgrid containing the box at i, j', function(){
            var board = sudokuPuzzleService.board;
            
            for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                    var acc = 0,
                        boxes = sudokuPuzzleService.getSubGridConstrained(i, j),
                        iSubGridStartIndex = Math.floor(i / 3) * 3;
                        jSubGridStartIndex = Math.floor(j / 3) * 3;
                    
                    for(var k = iSubGridStartIndex; k < iSubGridStartIndex + 3; k++){
                        for(var l = jSubGridStartIndex; l < jSubGridStartIndex + 3; l++){
                            acc += boxes.includes(board[k][l]);
                        }
                    }
                    
                    expect(acc).toBe(4);
                }
            }
        });
        
        it('returns a set of boxes with no duplicates', function(){
            var board = sudokuPuzzleService.board;
            
            for(var i = 0; i < 9; i++){
                for(var j = 0; j < 9; j++){
                    var boxes = sudokuPuzzleService.getSubGridConstrained(i, j);
                    
                    while(boxes.length > 1){
                        var comparisonBox = boxes.pop();
                        
                        expect(boxes.includes(comparisonBox)).toBe(false);
                    }
                }
            }
        });
        
        it('returns undefined for out of bound coordinates', function(){
            expect(sudokuPuzzleService.getSubGridConstrained(-1, -1)).toBe(undefined);
            expect(sudokuPuzzleService.getSubGridConstrained( 9, -1)).toBe(undefined);
            expect(sudokuPuzzleService.getSubGridConstrained(-1,  9)).toBe(undefined);
            expect(sudokuPuzzleService.getSubGridConstrained( 9,  9)).toBe(undefined);
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
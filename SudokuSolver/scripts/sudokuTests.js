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

    describe('The functions that require the board to be a 9x9 matrix.', function(){
        beforeEach(function(){
           sudokuPuzzleService.board = Array.apply(null, Array(9)).map(function(){
                return Array.apply(null, Array(9)).map(function(){
                    return new Box();
                });
            }); 
        });
        
        describe('The getSubGridConstrained function', function(){
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
                            iSubGridStartIndex = Math.floor(i / 3) * 3,
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

        describe('The getConstrained function', function(){
            
            it('returns a set of 20 boxes given coordinates to a box on the board', function(){
                for(var i = 0; i < 9; i++){
                    for(var j = 0; j < 9; j++){
                        var boxes = sudokuPuzzleService.getConstrained(i, j);
                        
                        expect(boxes.length).toBe(20);
                        boxes.forEach(function(box){
                            expect(box instanceof Box).toBe(true);
                        });
                    }
                }
            });
            
            it('does not include the box at board[i][j] in its result set', function(){
                for(var i = 0; i < 9; i++){
                    for(var j = 0; j < 9; j++){
                        var boxes = sudokuPuzzleService.getConstrained(i, j);
                        
                        expect(boxes.includes(sudokuPuzzleService.board[i][j])).toBe(false);
                    }
                }
            });
            
            it('includes all boxes in row i with the exception of board[i][j] in its result set', function(){
                for(var i = 0; i < 9; i++){
                    var boxRow = sudokuPuzzleService.board[i];
                    
                    for(var j = 0; j < 9; j++){
                        var boxes = sudokuPuzzleService.getConstrained(i, j);
                        
                        boxRow.forEach(function(box){
                            var boxIndex = boxes.indexOf(box);
                            
                            if(boxIndex !== -1){
                                boxes.splice(boxIndex, 1);
                            }
                        });
                        
                        expect(boxes.length).toBe(12);
                    }
                }
            });
            
            it('includes all boxes in column j with the exception of board[i][j] in its result set', function(){
                var boardTranspose = sudokuPuzzleService.board.map(function(row, i){
                    return row.map(function(column, j){
                        return sudokuPuzzleService.board[j][i];
                    });
                });
                
                for(var j = 0; j < 9; j++){
                    var boxColumn = boardTranspose[j];
                    
                    for(var i = 0; i < 9; i++){
                        var boxes = sudokuPuzzleService.getConstrained(i, j);
                        
                        boxColumn.forEach(function(box){
                            var boxIndex = boxes.indexOf(box);
                            
                            if(boxIndex !== -1){
                                boxes.splice(boxIndex, 1);
                            }
                        });
                        
                        expect(boxes.length).toBe(12);
                    }
                }
            });
            
            it('returns a set of boxes with no duplicates', function(){
                for(var i = 0; i < 9; i++){
                    for(var j = 0; j < 9; j++){
                        var boxes = sudokuPuzzleService.getConstrained(i, j);
                        
                        while(boxes.length > 1){
                            var comparisonBox = boxes.pop();
                            expect(boxes.includes(comparisonBox)).toBe(false);
                        }
                    }
                }
            });
            
            it('includes all boxes within the 3x3 subgrid containing the box at i, j with the exception of board[i][j] in its result set', function(){
                var board = sudokuPuzzleService.board;
                
                for(var i = 0; i < 9; i++){
                    for(var j = 0; j < 9; j++){
                        var acc = 0,
                            boxes = sudokuPuzzleService.getConstrained(i, j),
                            iSubGridStartIndex = Math.floor(i / 3) * 3,
                            jSubGridStartIndex = Math.floor(j / 3) * 3;
                        
                        for(var k = iSubGridStartIndex; k < iSubGridStartIndex + 3; k++){
                            for(var l = jSubGridStartIndex; l < jSubGridStartIndex + 3; l++){
                                acc += boxes.includes(board[k][l]);
                            }
                        }
                        
                        expect(acc).toBe(8);
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
        
        describe('The mapBoardValuesFromMatrix function', function(){
            it('only accepts a 9x9 2d array', function(){
                //pass null
                expect(function(){
                    sudokuPuzzleService.mapBoardValuesFromMatrix(null)
                }).toThrowError(Error, 'Param valueMatrix of mapBoardValuesFromMatrix not a 9x9 matrix.');
                
                //pass 1d array of length 9
                expect(function(){
                    sudokuPuzzleService.mapBoardValuesFromMatrix(new Array(9).fill(undefined));
                }).toThrowError(Error, 'Param valueMatrix of mapBoardValuesFromMatrix not a 9x9 matrix.');
                
                //pass 2d jagged array where the last nested array is not of length 9
                expect(function(){
                    var jaggedArray = Array.apply(null, Array(9)).map(function(){
                        return Array.apply(null, Array(9)).map(function(){
                            return undefined;
                        });
                    });
                    
                    jaggedArray[8].pop();
                    
                    sudokuPuzzleService.mapBoardValuesFromMatrix(jaggedArray);
                }).toThrowError(Error, 'Param valueMatrix of mapBoardValuesFromMatrix not a 9x9 matrix.');
                
                //pass 2d 9x9 array
                expect(function(){
                    sudokuPuzzleService.mapBoardValuesFromMatrix(Array.apply(null, Array(9)).map(function(){
                        return Array.apply(null, Array(9)).map(function(){
                            return undefined;
                        });
                    }));
                }).not.toThrow();
            });
            
            it('sets the value of the box at board[i][j] if the value of the input matrix at [i][j] is an integer between 1 and 9 inclusive', function(){
                sudokuPuzzleService.mapBoardValuesFromMatrix([
                    [NaN,   1, NaN, null, NaN, NaN, NaN, NaN, NaN],
                    [NaN, NaN, NaN,  NaN, NaN, NaN, NaN, NaN, NaN],
                    [NaN, NaN, NaN,  NaN, NaN, NaN,   3, NaN, NaN],
                    [NaN, NaN, NaN,  NaN, 'A', NaN, NaN, NaN, NaN],
                    [100, NaN, NaN,  NaN, NaN, NaN, NaN, 3.5, NaN],
                    [NaN, NaN, NaN, true, NaN, NaN, NaN, NaN, NaN],
                    [NaN, NaN, NaN,  NaN, NaN, [2], NaN, NaN, NaN],
                    [NaN, NaN,   0,  NaN, NaN, NaN, NaN, NaN, NaN],
                    [NaN, NaN, NaN,  NaN, NaN, NaN, NaN, NaN,   9]
                ]);
                
                var mappedCoordinates = [];
                
                sudokuPuzzleService.board.forEach(function(row, i){
                    row.forEach(function(box, j){
                        if(box.value !== undefined){
                            mappedCoordinates.push([i, j]);
                        }
                    });
                });
                
                expect(mappedCoordinates.length).toBe(3);
                expect(mappedCoordinates).toContain([0, 1]);
                expect(mappedCoordinates).toContain([2, 6]);
                expect(mappedCoordinates).toContain([8, 8]);
            });
        });
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
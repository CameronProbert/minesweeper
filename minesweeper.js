document.addEventListener('DOMContentLoaded', startGame);
document.addEventListener('click', checkForWin);
document.addEventListener('onContextMenu', checkForWin);

var board = {};
board.cells = [];

var boardSize = 6;

function startGame () {
  // Restrict the size of the board
  if (boardSize > 6) boardSize = 6;
  if (boardSize < 2) boardSize = 2;
  board = {};
  board.cells = [];
  setupTiles(boardSize);
  lib.initBoard();
}


// Creates each cell and sets it to initial values of not a mine, not marked, not hidden and not processed.
function setupTiles(size){
  //console.log('Setting up Tiles');
  for (var x = 0; x < size; x++){
    for (var y = 0; y < size; y++){
      board.cells.push({row: x,
                        col: y,
                        isMine: false,
                        hidden: true,
                        isMarked: false,
                        isProcessed:false});
    }
  }
  //console.log(board.cells);
  setupMines(size);

  // Count the mines surrounding each cell
  for (var i = 0; i < board.cells.length; i++){
    board.cells[i].surroundingMines = countSurroundingMines(board.cells[i]);
  }
}


// Places mines in 1/6th of the board, rounded up
function setupMines(size){
  var numMines = Math.ceil((size*size)/6);
  //var numMines = 1;
  //console.log('Number of Mines: ' + numMines);
  var i = 0;
  while (i < numMines){
    var mineX = Math.floor(Math.random()*size);
    var mineY = Math.floor(Math.random()*size);
    //console.log('Attempting to create mine at: ' + mineX + ', ' + mineY);
    for (var j = 0; j < board.cells.length;j++){
      //console.log('Finding Cell');
      if (board.cells[j].col == mineX && board.cells[j].row == mineY && !board.cells[j].isMine){
        //console.log('Mine Created');
        board.cells[j].isMine = true;
        i++;
      }
    }
  }
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin () {
  // You can use this function call to declare a winner (once you've
  // detected that they've won, that is!)
  //   lib.displayMessage('You win!')
  for (var i = 0; i < board.cells.length; i++){
    if (board.cells[i].isMine && !board.cells[i].isMarked){
      return false;
    }
    if (!board.cells[i].isMine && board.cells[i].hidden){
      return false;
    }
  }
  lib.displayMessage('You win!');
  return true;
}

function restart(){
  document.getElementsByClassName('board')[0].innerHTML = "";
  board = {};
  board.cells = [];
  setupTiles(boardSize);
  lib.initBoard();
  lib.displayMessage("Let's play!");
  //placeMines(boardSize);
}

// Define this function to count the number of mines around the cell
// (there could be as many as 8). You don't have to get the surrounding
// cells yourself! Just use `lib.getSurroundingCells`:
//
//   var surrounding = lib.getSurroundingCells(cell.row, cell.col)
//
// It will return cell objects in an array. You should loop through
// them, counting the number of times `cell.isMine` is true.
function countSurroundingMines (cell) {
  var neighbours = lib.getSurroundingCells(cell.row, cell.col);
  var count = 0;
  for (var i = 0; i < neighbours.length; i++){
    if (neighbours[i].isMine){
      count++;
    }
  }
  return count;
}

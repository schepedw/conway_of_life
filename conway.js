function Game(rows, columns, livingCells){

  function emptyGame(rows, columns){ 
    game = new Array(columns);
    for (var i = 0; i < columns; i++) {
      game[i] = new Array(rows);
      for (var j =0; j < rows; j++){
        cell = createCell(i, j);
        $('.gameSpace').append(cell);
        game[i][j] = cell;
      }
    }
    return game;
  }

  function createCell(x, y){
    cell = $("<div class='cell'></div>");
    cell.css("left", x * 20);
    cell.css("bottom", y * 20);
    cell.click(function(){
      if ($(this).hasClass('alive')){
        livingCells = jQuery.grep(livingCells, function(value){
          return !value.equals([x,y]);
        });
      }
      else{
        livingCells.push([x, y]);
      }
      $(this).toggleClass('alive');
    });
    return cell;
    }


  function populateCells(){
    for (var i = 0;  i < livingCells.length; i++){
      currentState[livingCells[i][0]][livingCells[i][1]].addClass("alive");
    }
  }

  function advanceGeneration(){
    var newCells = [];
    var currentX, currentY;
    for (var i = 0; i < livingCells.length; i++){
      var currentCell = livingCells[i];
      currentX = currentCell[0];
      currentY = currentCell[1];
      for (var j = currentX - 1; j <= currentX + 1; j++){
        for (var k = currentY - 1; k <= currentY + 1; k++){
          if (!indexOutOfBounds(j,k) && cellAliveNextGen(j, k)){
            newCells.push( [j, k] );
          }
        }
      }
    }
    return newCells;
  }


  function cellAliveNextGen(x, y){
    var currentCell = currentState[x][y];
    if (currentCell.hasClass("checked")){
      return false
    }
    currentCell.toggleClass("checked");
    //memoize livingNeighborCount, pass it to functions
    console.log("[" + x + ', '+y+'] has ' + livingNeighborCount(x,y) + 'neighbors');
    if (currentCell.hasClass("alive") && !cellShouldDie(x, y)){
      return true;
    }
    else if (!currentCell.hasClass("alive") && cellProcreateCheck(x, y)){
      return true;
    }
    return false;
  }

  function cellShouldDie(x, y){
    neighborCount = livingNeighborCount(x, y);
    return (neighborCount > 3 || neighborCount < 2);
  }

  function livingNeighborCount(x, y){
    var count = 0;
    for (var i = x - 1; i <= x + 1; i++){
      for (var j = y - 1; j <= y + 1; j++){
        if (!(x == i && j == y) && livingNeighborAt(i, j)){
          count++;
        }
      }
    }
    return count;
  }

  function livingNeighborAt(x, y){
    return !indexOutOfBounds(x, y) && currentState[x][y].hasClass("alive");
  }

  function indexOutOfBounds(x, y){
    if (x < 0 || y < 0) return true;
    if (x >= columns || y >= rows) return true;
    return false;
  }
  function cellProcreateCheck(x, y){
    return livingNeighborCount(x, y) == 3;
  }

  function drawNewGeneration(){
    $(".checked").toggleClass("checked");
    $(".alive, .checked").removeClass('alive').removeClass('checked');
    populateCells();
  }

  function reportTiming(endTime){
    elapsed = endTime - window.time;
    avg = elapsed / roundsDrawn - window.timeInterval;
    $('#avg_iteration').html(avg.toFixed(2) + 'ms / iteration (avg)');
  }

  currentState = emptyGame(rows, columns);
  populateCells();
  this.drawGeneration = function(){
    livingCells = advanceGeneration();
    drawNewGeneration();
    window.roundsDrawn++;
    reportTiming(new Date().getTime());
  }

}

var initialCells = function (){
  return [ /*
    [0,0],
    [0,1],
    [0,2],
    [1,0],
    [1,2],
    [2,0],
    [2,1],
    [2,2]*/
    [1,4],
    [2,4],
    [1,5],
    [2,5],
    [11,3],
    [11,4],
    [11,5],
    [12,6],
    [12,2],
    [13,1],
    [14,1],
    [13,7],
    [14,7],
    [15,4],
    [16,6],
    [16,2],
    [17,3],
    [17,4],
    [17,5],
    [18,4],
    [21,6],
    [21,7],
    [21,8],
    [22,6],
    [22,7],
    [22,8],
    [23,9],
    [23,5],
    [25,4],
    [25,5],
    [25,9],
    [25,10],
    [35,7],
    [35,8],
    [36,7],
    [36,8]
  ]
}

function button(game){
  var test = $('<button>Start</button>');
  test.click(function () { 
    //hack. Better way to do this?
    if ($(this).text() == 'Start'){
      window.timer = setInterval(game.drawGeneration, window.timeInterval);
      $(this).text('Pause');
      window.time = new Date().getTime();
      window.roundsDrawn = 0;
    }
    else{
      clearInterval(window.timer);
      $(this).text('Start');
    }
  });
  $(".gameSpace").append(test);
}

$(document).ready(function(){
  // get game size from user?
  var columns = 41;
  var rows = 20;
  window.timeInterval = 10;
  var game = new Game(rows, columns, initialCells());
  button(game);
});


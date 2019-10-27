//holds the state of the board
var boardState = [
    [0, 0, 0], 
    [0, 0, 0], 
    [0, 0, 0]
];
var canvas;
var width = 800;
var height = 800;
var cellWidth = width / 3;
var cellHeight = height / 3;
var context;
//example in document has two seperate variables to hold the players but it can also easily be done in 1.
//player 1 = 1 player 2 = 2
var currentPlayer;
 
//functions happen on pageload.
window.onload = function () {
    //creates canvas.
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
 
    //takes height/width variable and sets them to canvas.
    canvas.width = width;
    canvas.height = height;
 
    //allows onclick events to happen on the canvas.
    canvas.onclick = onCanvasClick;
 
    //refreshes the game and draws the current boardstate, will refresh if nostate ie game over and restarting
    refreshGame();
     
    currentPlayer = 1;
 
};
 
//used to reinitate the board after each move/game
function refreshGame() {
    context.clearRect(0, 0, width, height);
    drawGameBoard();
    drawPlayerMoves();
}
 
//function draws the gameBoard
function drawGameBoard() {
 
    //left vertical line
    context.beginPath();
    context.moveTo(cellWidth, 0);
    context.lineTo(cellWidth, height);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
 
    // right vertical line 
    context.beginPath();
    context.moveTo(cellWidth * 2, 0);
    context.lineTo(cellWidth * 2, height);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

 
    // top horizontal line 
    context.beginPath();
    context.moveTo(0, cellHeight);
    context.lineTo(width, cellHeight);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

 
    // bottom horizontal line 
    context.beginPath();
    context.moveTo(0, cellHeight * 2);
    context.lineTo(width, cellHeight * 2);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

}


 //Displays winner/tie along with restarting game.
function gameWon(msg) {
    alert(msg);
    boardState = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    currentPlayer = 1;
    refreshGame();
}

//this function takes the current boardState and draws the moves already made by the players onto the board. Will be called on refreshGrame() and gameWon()
function drawPlayerMoves() {
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            //var boardstate
            var cell = boardState[i][j];
            if (cell == 1) {
                drawX(i, j);
 
            } else if (cell == 2) {
                drawCircle(i, j);
            }
        }
    }
}
 
//Function handles the onclick events for the canvas
function onCanvasClick(e) {
    var mouseCoordinate = getMouse(e);
    var cell = getCell(mouseCoordinate);
    
    hasClicked(cell);
}

 
// Getting mouse x,y coordinates on click event
function getMouse(e) {
 
    var mouseX = e.pageX - canvas.offsetLeft;
    var mouseY = e.pageY - canvas.offsetTop;
 
    return { x: mouseX, y: mouseY };
}
 
// gets cell from mouse coords
function getCell(mouseCoordinate) {
    var cellCoordinate = { x: 0, y: 0 };
    
    if (mouseCoordinate.x > cellWidth * 2) cellCoordinate.x = 2;
    else if (mouseCoordinate.x > cellWidth) cellCoordinate.x = 1;
 
    if (mouseCoordinate.y > cellHeight * 2) cellCoordinate.y = 2;
    else if (mouseCoordinate.y > cellHeight) cellCoordinate.y = 1;

    return cellCoordinate;
}
 
//is called when the canvas has been clicked, if the space is already taken it informs the user and returns
//Else it runs as normal.
function hasClicked(cell) {
    if (boardState[cell.x][cell.y] != 0){
        alert("This space has already been claimed");
        return;
    } 
    boardState[cell.x][cell.y] = currentPlayer;
    
    refreshGame();
 
    if (currentPlayer == 1) currentPlayer = 2;
    else currentPlayer = 1;
    
    //Checks win
    checkSolved();
}
 
//This function draws the X
function drawX(cellX, cellY) {
    // top right -> bottom left
    context.beginPath();
    context.moveTo(cellX * cellWidth, cellY * cellHeight);
    context.lineTo(cellX * cellWidth + cellWidth, cellY * cellHeight + cellHeight);
    context.strokeStyle = 'yellow';
    context.lineWidth = 1;
    context.stroke();   
    context.closePath();

 
    // top left ->bottom right
    context.beginPath();
    context.moveTo(cellX * cellWidth + cellWidth, cellY * cellHeight);
    context.lineTo(cellX * cellWidth, cellY * cellHeight + cellHeight);
    context.strokeStyle = 'yellow';
    context.lineWidth = 1;
    context.stroke();
    context.closePath();
}
 

//Draws a isFull circle
function drawCircle(cellX, cellY) {
    context.beginPath();
    context.arc(cellX * cellWidth + cellWidth / 2, cellY * cellHeight + cellHeight / 2, cellWidth / 2, 0, 360, false);
    context.strokeStyle = 'Red';
    context.lineWidth = 1;
    context.stroke();
    context.closePath();

}
 
// Checks for Win/draw
function checkSolved() {
 
    var isFull = true;
 
    for (var i = 0; i < 3; i++) {
        var p1Rows = 0, p1Columns = 0;
        var p2Rows = 0, p2Columns = 0;
        for (var j = 0; j < 3; j++) {
            // checks rows
            if (boardState[j][i] == 1)
                p1Rows++;
            else if (boardState[j][i] == 2)
                p2Rows++;
            else
                isFull = false;
 
            // checks columns
            if (boardState[i][j] == 1)
                p1Columns++;
            else if (boardState[i][j] == 2)
                p2Columns++;
        }
 
        // checks diags
        var p1Diag = boardState[0][0] == 1 && boardState[1][1] == 1 && boardState[2][2] == 1;
        p1Diag = p1Diag || boardState[0][2] == 1 && boardState[1][1] == 1 && boardState[2][0] == 1;
 
        var p2Diag = boardState[0][0] == 2 && boardState[1][1] == 2 && boardState[2][2] == 2;
        p2Diag = p2Diag || boardState[0][2] == 2 && boardState[1][1] == 2 && boardState[2][0] == 2;
 
        // performs win
        if (p1Rows == 3 || p1Columns == 3 || p1Diag) {
            gameWon("Player 1 wins!");
            return;
        } else if (p2Rows == 3 || p2Columns == 3 || p2Diag) {
            gameWon("Player 2 wins!");
            return;
        }
    }
    // Checking draw
    if (isFull) {
        gameWon("Game Tied!!");
    }
}
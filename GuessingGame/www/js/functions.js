//gets random number
var y = Math.floor(Math.random() * 10 + 1);
//counts guesses
var guesses = 1;

//when the submit button is hit
document.getElementById("submitguess").onclick = function () {
    //grabs value from userGuess
    var x = document.getElementById("userGuess").value;
    //Win
    if (x == y) {
        alert("You guessed the correct number! it took "
            + guesses + " guesses ");
        navigator.vibrate(2000);
    }
    //Wrong small
    else if (x > y) {
        guesses++;
        alert("Try a smaller number!");
        navigator.vibrate(100);
    }
    //Wrong large
    else {
        guesses++;
        alert("Try a larger number!")
        navigator.vibrate(100);
    }
    //Reset game button
    function resetGame() {
        navigator.vibrate(200);
        guesses = 1;
        y = Math.floor(Math.random() * 10 + 1);
        document.getElementById('reset').style.visibility='visible';
        navigator.vibrate(200);
    }
} 
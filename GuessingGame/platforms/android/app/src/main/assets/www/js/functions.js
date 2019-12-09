var y = Math.floor(Math.random() * 10 + 1);
var guesses = 1;

document.getElementById("submitguess").onclick = function () {
    var x = document.getElementById("userGuess").value;
    if (x == y) {
        alert("You guessed the correct number! it took "
            + guesses + " guesses ");
        navigator.vibrate(2000);
    }
    else if (x > y) {
        guesses++;
        alert("Try a smaller number!");
        navigator.vibrate(100);
    }
    else {
        guesses++;
        alert("Try a larger number!")
        navigator.vibrate(100);
    }
    function resetGame() {
        navigator.vibrate(200);
        guesses = 1;
        y = Math.floor(Math.random() * 10 + 1);
        document.getElementById('reset').style.visibility='visible';
        navigator.vibrate(200);
    }
} 
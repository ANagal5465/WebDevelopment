var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight/1.35;

var c = canvas.getContext('2d');
var word = "";
var z = 0;


//function is used when the playbutton is clicked. begins most functions.
$(document).ready(function(){
    $('#submit').click(function() {
        document.getElementById("playButton").disabled=true
        var selValue = $('input[name=radio]:checked').val(); 
        $.ajax({
            url: "https://hangman-api.lively.software/?difficulty="+ selValue,
            cache: false,
            success: function(html){
              $("#results").append(html);
              y = html;
              word = y["word"];
              drawLines();
              
              play();
            }
          });
        
    });
    
});

//this is the next button, this is used to make each move.
$(document).ready(function(){
    $('#next').click(function() {
        play();
    });
    
});

//function for wrong answer
function firstWrong(){
    c.beginPath();
    c.moveTo(10, 710);
    c.lineTo(450, 710);
    c.lineTo(450, 655);
    c.lineTo(10, 655);
    c.lineTo(10, 710);
    c.strokeStyle = "black";
    c.stroke();
}
//function for wrong answer

function secondWrong(){
    //Post of Post
    c.beginPath();
    c.moveTo(190, 655);
    c.lineTo(190, 110);
    c.lineTo(510, 110);
    c.lineTo(510, 160);
    c.lineTo(270, 160);
    c.lineTo(270, 655);
    c.strokeStyle = "black";
    c.stroke();
}
//function for wrong answer

function thirdWrong(){
    //Rope
    c.beginPath();
    c.moveTo(480, 160);
    c.lineTo(480, 210);
    c.strokeStyle = "black";
    c.stroke();
}
//function for wrong answer

function forthWrong(){
    //Head
    c.beginPath();
    c.arc(480, 240, 30, 0, Math.PI*2, false);
    c.closePath();
    c.stroke();
}
//function for wrong answer

function fifthWrong(){
    //Body
        c.beginPath();
        c.moveTo(480, 270);
        c.lineTo(480, 400);
        c.strokeStyle = "black";
        c.stroke();

    
}
//function for wrong answer

function sixthWrong(){
    //arms
    c.beginPath();
    c.moveTo(480, 270);
    c.lineTo(450, 350);
    c.strokeStyle = "black";
    c.stroke();

    c.beginPath();
    c.moveTo(480, 270);
    c.lineTo(510, 350);
    c.strokeStyle = "black";
    c.stroke();

    //legs
    c.beginPath();
    c.moveTo(480, 400);
    c.lineTo(450, 470);
    c.strokeStyle = "black";
    c.stroke();

    c.beginPath();
    c.moveTo(480, 400);
    c.lineTo(510, 470);
    c.strokeStyle = "black";
    c.stroke();

}
//displays the board.
function board(){
    //Board
    c.beginPath();
    c.moveTo(270, 470);
    c.lineTo(510, 470);
    c.strokeStyle = "black";
    c.stroke();
}

//death animation function.
function death(){
    while(z < 90){
    requestAnimationFrame(death);
    c.clearRect(0,0,innerWidth,innerHeight);
    firstWrong();
    secondWrong();
    thirdWrong();


    //Board
    c.beginPath();
    c.moveTo(420, 470);
    c.lineTo(510, 470);
    c.strokeStyle = "white";
    c.stroke();

    //Rope
    c.beginPath();
    c.moveTo(480, 160);
    c.lineTo(480, 210+z);
    c.strokeStyle = "black";
    c.stroke();

    //Head
    c.beginPath();
    c.arc(480, 240+z, 30, 0, Math.PI*2, false);
    c.closePath();
    c.stroke();

    //Body
    c.beginPath();
    c.moveTo(480, 270+z);
    c.lineTo(480, 400+z);
    c.strokeStyle = "black";
    c.stroke();

    //arms
    c.beginPath();
    c.moveTo(480, 270+z);
    c.lineTo(450, 350+z);
    c.strokeStyle = "black";
    c.stroke();

    c.beginPath();
    c.moveTo(480, 270+z);
    c.lineTo(510, 350+z);
    c.strokeStyle = "black";
    c.stroke();

    c.beginPath();
    c.moveTo(480, 400+z);
    c.lineTo(450, 470+z);
    c.strokeStyle = "black";
    c.stroke();

    c.beginPath();
    c.moveTo(480, 400+z);
    c.lineTo(510, 470+z);
    c.strokeStyle = "black";
    c.stroke();
    z++;
    }
    if(confirm("you lost, Would you like to play again?")){
        counter = 0;
        word = "";
        x = 0;
        arrayContains = 0;
        num = 0;
        c.clearRect(0,0,innerWidth,innerHeight);

        var selValue = $('input[name=radio]:checked').val(); 
        $.ajax({
            url: "https://hangman-api.lively.software/?difficulty="+ selValue,
            cache: false,
            success: function(html){
            $("#results").append(html);
            y = html;
            word = y["word"];
            drawLines();
            play();
            }
        });
    }else{
        return;
    }
}
//calls each wrong instance
function callWrong(val){
    if(val == 0){
        firstWrong();
        console.log(0);
    }
    if(val == 1){
        secondWrong();
        board();
        console.log(1);
    }
    if(val == 2){
        thirdWrong();
        console.log(2);
    }
    if(val == 3){
        forthWrong();
        console.log(3);
    }
    if(val == 4){
        fifthWrong();
        console.log(4);
    }
    if(val == 5){
        sixthWrong();
        console.log(5);
    }
    if(val == 6){ 
        death();
    }
}   
    

    
var x = 0;
var num = 0;
//draws the underscores for each letter in the word.
function drawLines(){
    for(var i = 0; i < word.length; i++){
        c.moveTo(690+x,490);
        c.lineTo(710+x,490);
        c.strokeStyle = "black";
        c.stroke();
        x+=25;
    }
}
var counter = 0;

var usedCharIncrementor = 1000;
//Shows used characters
function usedChars(chars){
        usedCharIncrementor = usedCharIncrementor + 25;
        c.font = "20px Arial";
        c.fillText(chars,usedCharIncrementor,100); 
    }  

//play function
function play(){
    console.log(word);
    

    var lettersLeft;
    var characters = [];
    var guessedChars = [];
    var alreadyUsedChars = [];

    

    
    for(var i = 0; i < word.length;i++){
        characters[i]= word.charAt(i);
    }
    
    var userGuess = prompt("Plese enter your guess");
    var arrayContains = 0;
    if (userGuess != null) {
        for(var i = 0; i < characters.length;i++){
            if(userGuess == characters[i]){
                c.font = "30px Arial";
                c.fillText(characters[i],693+(i*25),485);
                characters[i] = guessedChars[i];
                arrayContains++;
                console.log(arrayContains + " i am arrayContains");
            }
             
        }
        alreadyUsedChars = userGuess;
        usedChars(alreadyUsedChars);
        if(arrayContains == 0){
            callWrong(num);
            num++;
        }
        var arrayContains = 0;
        
        for(var i = 0; i <characters.length; i ++){
            if(characters[i] == guessedChars[i]){
                counter = counter + 1;

            } 
        }
        if(counter == characters.length){
            if(confirm("you won! Would you like to play again?")){
                counter = 0;
                word = "";
                x = 0;
                arrayContains = 0;
                num = 0;
                c.clearRect(0,0,innerWidth,innerHeight);

                var selValue = $('input[name=radio]:checked').val(); 
                $.ajax({
                    url: "https://hangman-api.lively.software/?difficulty="+ selValue,
                    cache: false,
                    success: function(html){
                    $("#results").append(html);
                    y = html;
                    word = y["word"];
                    drawLines();
                    play();
                    }
                });
            }
        }else{
            return;
        }
    }
    
}

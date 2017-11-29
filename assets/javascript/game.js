// Initialize Firebase
var config = {
    apiKey: "AIzaSyCsAdORiADM5MKd6RFZnJOJzZwB0o6414w",
    authDomain: "rpsgame-5c5dc.firebaseapp.com",
    databaseURL: "https://rpsgame-5c5dc.firebaseio.com",
    projectId: "rpsgame-5c5dc",
    storageBucket: "",
    messagingSenderId: "115703104064"
  };

  firebase.initializeApp(config);

// Create a variable to reference the database
 var database = firebase.database();
 var arrRPS = ['Rock','Paper','Scissors'];
 var playerName = "";
 var wins = 0;
 var losses = 0;
 var selectedValue1 = "";
 var selectedValue2 = "";
 var selectedValue = "";
 var player = null;
 var playerTurn =1;
 var winner = 0;
 var win1 = 0;
 var win2 = 0;
 var losses1 = 0;
 var losses2 = 0;
 var winFlag = false;
 var existingPlayers = null;


  
//database.ref().on("value", function(snapshot) {

 // player = snapshot.val().player;

//});

// startbtn adds player in firebase
$("#startBtn").on("click", function() {
  // Prevent the page from refreshing
  event.preventDefault();
  //calling a function to add a new player
  addNewUser();
  
  });

database.ref("/players/").on("value", function(snapshot) {

existingPlayers = snapshot.numChildren();
player1Exists = snapshot.child("1").exists();
player2Exists = snapshot.child("2").exists();

for (i=1;i <3; i++) {
    if (snapshot.child(i).exists()) {

        var childName = snapshot.child(i).val().playerName;
        var childWin = snapshot.child(i).val().wins;
        var childLosses = snapshot.child(i).val().losses;
        var childSelection = snapshot.child(i).val().selectedValue;

        $("#playerName"+i).text("Player "+ i + ": " + childName);
        $("#p" + i + "Wins").text("Wins: " + childWin);
        $("#p" + i + "Losses").text("Losses: " + childLosses);
    }
    else
    {
      $("#playerName"+i).text("Waiting for Player 1");
      $("#p" + i + "Wins").empty();
      $("#p" + i + "Losses").empty();
   }
}

});

database.ref("/players/").on("value", function(snapshot) {

if (snapshot.child(2).exists() && !(winFlag)) {
  if ((snapshot.child("2").val().selectedValue !== '') && (snapshot.child("2").val().selectedValue !== '')) {
      var result = checkWinner(snapshot.child("1").val().selectedValue,snapshot.child("2").val().selectedValue)  
      if (result===1) {
          $("#result").text("The winner is : " + snapshot.child("1").val().playerName);
          winner = 1;
      }
      else if (result ===2){  
        $("#result").text("The winner is : " + snapshot.child("2").val().playerName);
        winner = 2;
      }
      else{
        winner = 0;
        $("#result").text("It's a tie");
      }
      $("#result").addClass("largeFont");
    }

  }

});



$("#display1Btn").on("click", function(e) {
  
  e.preventDefault();
    $("#p1Selection").empty();
    var newDiv = $("<div>"+  selectedValue1 +"</div>");
    $(newDiv).addClass("largeFont");
    $("#p1Selection").append(newDiv);
    $("#player2").addClass("borderColor");  
  
  });


$(document).on("click", ".selection1", function(e){
//$("#Rock1").on("click",function(e) {
  winFlag = false;
  e.preventDefault();
  database.ref("turn").set("2");
 selectedValue1 = $(this).attr("data-value");
 database.ref("/players/1/selectedValue").set(selectedValue1);
 $("#display1Btn").click();

// $("#p1Selection").empty();
 //var newDiv = $("<div>"+  selectedValue1 +"</div>");
 //$(newDiv).addClass("largeFont");
 //$("#p1Selection").append(newDiv);
 //selectionList(2);
// $("#player2").addClass("borderColor");


});

$(document).on("click", ".selection2", function(e){
  //$("#Rock1").on("click",function(e) {
  
   e.preventDefault();
   database.ref("turn").set("1");
   selectedValue2 = $(this).attr("data-value"); 
   database.ref("/players/2/selectedValue").set(selectedValue2);
   $("#p2Selection").empty();
   var newDiv = $("<div>"+  selectedValue2 +"</div>");
   $(newDiv).addClass("largeFont");
   $("#p2Selection").append(newDiv);
     
   
   $("#player1").addClass("borderColor");
  winFlag = true;
  if (winner===1){
    win1++;
    losses2++;
    database.ref("/players/1/wins").set(win1);
    database.ref("/players/2/losses").set(losses2);
  }  else if (winner===2){
    win2++;
    losses1++
    database.ref("/players/2/wins").set(win2);
    database.ref("/players/1/losses").set(losses1);
  } 
  });

function selectionList(key){

   $("#p"+ key + "Selection").empty();
    for (i=0; i < arrRPS.length;i++){
      var newDiv = $("<div>"+  arrRPS[i] +"</div>");
      $(newDiv).addClass("selection"+key);
      $(newDiv).attr("data-value",arrRPS[i]);
      $(newDiv).attr("id",arrRPS[i]+key);
      
      $("#p"+ key + "Selection").append(newDiv);
    }
}

function addNewUser(){

  if (existingPlayers < 2) {
    playerName = $("#playerName").val().trim();
    //chek if it is the first player and add a record in the firebase
    if (player1Exists){
        player = 2;     
        database.ref("/players").child("2").set({
        playerName: playerName,
        wins : 0,
        losses : 0,
        selectedValue : null,
        });
        database.ref("/players/2").onDisconnect().remove();
        database.ref("turn").onDisconnect().remove();
        $("#playerNameDiv").empty();
        $("#playerNameDiv").html("<h2>Hi " + playerName + "! You are Player 2" + "</h2>");
        //  selectionList(1);
       //     $("#player1").addClass("borderColor");
    } 
    else 
    {
    // check if it is the second player and add a record in firebase   
       player = 1; 
       //database.ref("turn").set("1");
       database.ref("/players").child("1").set({
        playerName: playerName,
        wins : wins,
        losses : losses,
        selectedValue : null,
        });
        database.ref("/players/1").onDisconnect().remove();
        database.ref("turn").onDisconnect().remove();
        $("#playerNameDiv").empty();
        $("#playerNameDiv").html("<h2>Hi " + playerName + "! You are Player 1" + "</h2>");
        //  selectionList(2);
       //   $("#player1").addClass("borderColor");
    } 
}
else
{   
  alert("There are already 2 players in the game");
}
}

function checkWinner(choice1,choice2){
  
    if (choice1 === choice2) {
        return 0;
    }
    if (choice1 === "Rock") {
        if (choice2 === "Scissors") {
            // rock wins
            return 1;
        } else {
            // paper wins
            return 2;
        }
    }
    if (choice1 === "Paper") {
        if (choice2 === "Rock") {
            // paper wins
            return 1;
        } else {
            // scissors wins
            return 2;
        }
    }
    if (choice1 === "Scissors") {
        if (choice2 === "Rock") {
            // rock wins
            return 2;
        } else {
            // scissors wins
            return 1;
        }
    }
};




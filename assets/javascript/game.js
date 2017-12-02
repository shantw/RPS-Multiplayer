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
 var existingPlayers = null;
 var player = false;
 var playerTurn =null;
 var player1Info = null;
 var player2Info = null;
 var winner = 0;
 var win1 = 0;
 var win2 = 0;
 var losses1 = 0;
 var losses2 = 0;
 var selectedValue1 = "";
 var selectedValue2 = "";
 var playerName = "";

 var wins = 0;
 var losses = 0;
  var selectedValue = "";



// startbtn adds player in firebase
$("#startBtn").on("click", function() {
  // Prevent the page from refreshing
  event.preventDefault();
  //calling a function to add a new player
  addNewUser();
  
});


// CHAT Btn
$("#chatSendBtn").click(function() {

  if ($("#chatInput").val() !== "") {

    var chatMsg = $("#chatInput").val();
    database.ref("/chat").push({
    name: playerName,
    message: chatMsg,
    time: firebase.database.ServerValue.TIMESTAMP,
    id: player
    });
    $("#chatInput").val("");
  }

});


// Handle chat screen 




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
        if (i===1){
          player1Info = snapshot.child("1").val();
         }
         else{
          player2Info = snapshot.child("2").val();
         }
    }
    else
    {
      $("#playerName"+i).text("Waiting for Player " + i);
      $("#p" + i + "Wins").empty();
      $("#p" + i + "Losses").empty();
   }

}

});

database.ref("/players/").on("child_added", function(snapshot) {
  if (existingPlayers === 1) {
    database.ref("turn").set(1);
  }
});

database.ref("turn").on("value", function(snap) {

  playerTurn = snap.val();
  //console.log(playerTurn);
  //if (player === 1 || player ===2) {
    if (player) {
    // For turn 1
    if (playerTurn === 1) {
      console.log("p" + player);
      if (playerTurn === player) {
        
        $("#turn").html("<h2>It's Your Turn!</h2>");
        selectionList(1);
      }
      else {
        
        $("#turn").html("<h2>Waiting for Player 1 to choose.</h2>");
      }
     // $("#player1").addClass("borderColor");
      $("#player1").css("border", "2px solid blue");
      $("#player2").css("border", "2px solid grey");
    }
    else if (playerTurn === 2) {

      if (playerTurn === player) {
        $("#turn").html("<h2>It's Your Turn!</h2>");
        selectionList(2);
      }
      else {
        $("#turn").html("<h2>Waiting for player 2  to choose.</h2>");
      }
      //console.log($("#player1").text());
      //$("#player2").addClass("borderColor");
      $("#player2").css("border", "2px solid blue");
      $("#player1").css("border", "2px solid grey");
    }
    else if (playerTurn === 3) {
      winner = checkWinner(player1Info.selectedValue,player2Info.selectedValue);

      $("#p1Selection").text(player1Info.selectedValue);
      $("#p2Selection").text(player2Info.selectedValue);

      $("#result").addClass("resultFont");
      if (winner===1){
        win1++;
        losses2++;
        database.ref("/players/1/wins").set(win1);
        database.ref("/players/2/losses").set(losses2);
        $("#result").html(player1Info.playerName + " Wins!");
      }  else if (winner===2){
        win2++;
        losses1++
        database.ref("/players/2/wins").set(win2);
        database.ref("/players/1/losses").set(losses1);
        $("#result").html(player2Info.playerName + " Wins!");
      } 
      else{
        $("#result").html("<h2> It's a Tie </h2><h2>Wins!</h2>");
      }

      //  set timeout
      var reset = function() {
        $("#p1Selection").empty();
        $("#p2Selection").empty();
        $("#result").empty();
        $("#result").removeClass("resultFont");
        $("#p1Selection").removeClass("largeFont");
        $("#p2Selection").removeClass("largeFont");

      if (player1Exists && player2Exists) {
        database.ref("turn").set(1);
        console.log(playerTurn);
      }
      };
      setTimeout(reset, 3000);
      

    }
    else {
      $("#p1Selection").empty();
      $("#p2Selection").empty();
      $("#turn").html("<h2>Waiting for a player to join.</h2>");
      $("#player2").css("border", "2px solid grey");
      $("#player1").css("border", "2px solid grey");
    }
  }
});

$(document).on("click", ".selection1", function(e){
    e.preventDefault();
    selectedValue1 = $(this).attr("data-value");
   database.ref("/players/1/selectedValue").set(selectedValue1);
   $("#p1Selection").empty();
  // var newDiv = $("<div>"+  selectedValue1 +"</div>");
  // $(newDiv).addClass("largeFont");
  // $("#p1Selection").append(newDiv);
  $("#p1Selection").text(selectedValue1);
  $("#p1Selection").addClass("largeFont");
    playerTurn++; 
  
  database.ref("turn").set(playerTurn);
});


$(document).on("click", ".selection2", function(e){
 
   e.preventDefault();

   selectedValue2 = $(this).attr("data-value");
   database.ref("/players/2/selectedValue").set(selectedValue2);
   $("#p2Selection").empty();
  $("#p2Selection").text(selectedValue2);
  $("#p2Selection").addClass("largeFont");
  playerTurn++; 
  database.ref("turn").set(playerTurn);

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
        selectedValue : '',
        });
        database.ref("/players/2").onDisconnect().remove();
        database.ref("turn").onDisconnect().remove();
        $("#playerNameDiv").empty();
        $("#playerNameDiv").html("<h3>Hi " + playerName + "! You are Player 2" + "</h3>");
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
        selectedValue : '',
        });
        database.ref("/players/1").onDisconnect().remove();
        database.ref("turn").onDisconnect().remove();
        $("#playerNameDiv").empty();
        $("#playerNameDiv").html("<h3>Hi " + playerName + "! You are Player 1" + "</h3>");
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




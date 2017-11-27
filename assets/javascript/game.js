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
 var numberOfUsers ;
 var arrRPS = ['Rock','Paper','Scissors'];
 var playerName = "";
 var wins = 0;
 var losses = 0;
 var selectedValue1 = "";
 var selectedValue2 = "";
 var selectedValue = "";
 var player = "none";
 var selected1 = false;
 var selected2 = false;
 var playerTurn =1;


 //var playersCount = 0;

 var connectionsRef = database.ref("/connections");
 
 // '.info/connected' is a special location provided by Firebase that is updated every time
 // the client's connection state changes.
 // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
 var connectedRef = database.ref(".info/connected");
 
 // When the client's connection state changes...
 connectedRef.on("value", function(snap) {
 
   // If they are connected..
   if (snap.val()) {
 
     // Add user to the connections list.
     var con = connectionsRef.push(true);
      
     // Remove user from the connection list when they disconnect.
     con.onDisconnect().remove();
   }
 });
 
 // When first loaded or when the connections list changes...
 connectionsRef.on("value", function(snap) {
 
   // The number of online users is the number of children in the connections list.
   numberOfUsers= snap.numChildren();
   console.log("nbrusers " + numberOfUsers);
 });

// Initial Variables (SET the first set IN FIREBASE FIRST)


database.ref().on("value", function(snapshot) {

  player = snapshot.val().player;

});

database.ref("/players/").on("value", function(snapshot) {

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
}

});

database.ref("/players/").on("value", function(snapshot) {

if (snapshot.child(2).exists()) {
  if ((snapshot.child("2").val().selectedValue !== '') && (snapshot.child("2").val().selectedValue !== '')) {
      var result = checkWinner(snapshot.child("1").val().selectedValue,snapshot.child("2").val().selectedValue)  
      if (result===1) {
          $("#result").text("The winner is : " + snapshot.child("1").val().playerName);
      }
      else if (result ===2){  
        $("#result").text("The winner is : " + snapshot.child("2").val().playerName);
      }
      else{
        $("#result").text("It's a tie");
      }
    }

  }

});


// startbtn adds player in firebase
$("#startBtn").on("click", function() {
// Prevent the page from refreshing
event.preventDefault();
//calling a function to add a new player
sessionStorage.clear();
if (player==="one"){
  sessionStorage.setItem('key' , 'window1');
  }
  else if (player==="two")
  {
    sessionStorage.setItem('key' , 'window2');
  }
//window.sessionStorage.key()

addNewUser();

});

$(document).on("click", ".selection1", function(e){
//$("#Rock1").on("click",function(e) {

  e.preventDefault();
  selected1 = true;
 selectedValue1 = $(this).attr("data-value");
 database.ref("/players/1/selectedValue").set(selectedValue1);
 $("#p1Selection").empty();
 var newDiv = $("<div>"+  selectedValue1 +"</div>");
 $(newDiv).addClass("largeFont");
 $("#p1Selection").append(newDiv);
 selectionList(2);
 $("#player2").addClass("borderColor");

  //database.ref("player1").set("two");

});

$(document).on("click", ".selection2", function(e){
  //$("#Rock1").on("click",function(e) {
  
    e.preventDefault();
    selected2 = true;
   selectedValue2 = $(this).attr("data-value"); 
   database.ref("/players/2/selectedValue").set(selectedValue2);
   $("#p2Selection").empty();
   var newDiv = $("<div>"+  selectedValue2 +"</div>");
   $(newDiv).addClass("largeFont");
   $("#p2Selection").append(newDiv);
   selectionList(1);
   $("#player1").addClass("borderColor");

   //var result = checkWinner(fplayerName1,fplayerName2);
  //console.log(result);
   //if (result===1){
     //database.ref("/players/1/wins").set(selectedValue2++);
  //   console.log(database.ref("/players/1/wins").val());
  // } else if (result===2){
    //database.ref("/players/2/wins").set(selectedValue2++);
  //  console.log(database.ref("/players/2/wins").val());
  // }

  
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

  if (numberOfUsers < 3) {
    playerName = $("#playerName").val().trim();
    //chek if it is the first player and add a record in the firebase
    if (player==="one"){   
        database.ref("player").set("two");
    
            database.ref("/players").child("1").set({
            playerName: playerName,
            wins : wins,
            losses : losses,
            selectedValue : selectedValue,
        });
        //if (numberOfUsers > 1){
          selectionList(1);
       //     $("#player1").addClass("borderColor");
       // }
        

    } else if (player==="two"){
    // check if it is the second player and add a record in firebase    
       database.ref("player").set("full");
       database.ref("/players").child("2").set({
            playerName: playerName,
            wins : wins,
            losses : losses,
            selectedValue : selectedValue,
        });
        if (numberOfUsers > 1){
          selectionList(2);
       //   $("#player1").addClass("borderColor");
     }
    } 
}
else{   
  alert("there are already 2 players in the game");
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




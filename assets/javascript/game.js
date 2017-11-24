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

  firebase.database().ref().on("value",function(snapshot){
        console.log(snapshot.val());    
  });

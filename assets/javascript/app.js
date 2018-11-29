var config = {
    apiKey: "AIzaSyAkSYfO3SYUMcY0k5w-SVCpZerzTLEmH-Y",
    authDomain: "train-scheduler-38ef0.firebaseapp.com",
    databaseURL: "https://train-scheduler-38ef0.firebaseio.com",
    projectId: "train-scheduler-38ef0",
    storageBucket: "train-scheduler-38ef0.appspot.com",
    messagingSenderId: "58297508957"
  };
firebase.initializeApp(config);

var database = firebase.database();

$("#submit").on("click", function(event) {
    event.preventDefault();
    var name = $("#train-name").val().trim();
    var destination = $("#train-destination").val().trim();
    var firstTime = $("#train-time").val().trim();
    var frequency = $("#train-frequency").val().trim();
    // put math here
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemainder = diffTime % frequency;
    var minutesTil = frequency - timeRemainder;
    var nextTrain = moment().add(minutesTil, "minutes");
    var nextArrival = moment(nextTrain).format("hh:mm");
    // end math
    database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        minutesTil: minutesTil,
        nextArrival: nextArrival
    });
    alert("Train successfully added.");
    $("input").val("");
});

database.ref().on("child_added", function(snapshot) {
    var newRow = $("<tr>").append(
        $("<td>").text(snapshot.val().name),
        $("<td>").text(snapshot.val().destination),
        $("<td>").text(snapshot.val().frequency),
        $("<td>").text(snapshot.val().nextArrival),
        $("<td>").text(snapshot.val().minutesTil)
    );
    $("tbody").append(newRow);
}, function(errorObj) {
    console.log(errorObj.code);
});
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);
            getNameFromAuth()
            insertNameFromFirestore();
            // the following functions are always called when someone is logged in
            getBottleCount(user);
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}
// getNameFromAuth(); //run the function

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                var userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
                console.log("User name inserted into HTML");
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

// insertNameFromFirestore();



let bottleCount = 0;

// Function to update the display with the bottle count
function updateCountDisplay(count) {
    document.getElementById('countValue').innerText = count;
}

// Function to increase count
function refill() {
    // Increment the count
    bottleCount++;

    // Update the display
    updateCountDisplay(bottleCount);

    // Save the updated bottle count to Firestore
    saveBottleCount();
}

// Function to decrease count
function undo() {
    // Decrement the count
    bottleCount--;

    // Update the display
    updateCountDisplay(bottleCount);

    // Save the updated bottle count to Firestore
    saveBottleCount();
}

// Function to save bottle count in Firestore
function saveBottleCount() {
    // Get the updated bottle count
    const bottleCountSaved = bottleCount;

    // Update the 'countValue' field in the user's Firestore document
    currentUser.update({
        countValue: bottleCountSaved
    }).then(function () {
        console.log("Bottle count updated in Firestore");
    }).catch(function (error) {
        console.error("Error updating bottle count: ", error);
    });
}


function getBottleCount(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            // Get the bottle count
            bottleCount = userDoc.data().countValue;

            // Update the display
            updateCountDisplay(bottleCount);
        }
        );
}

var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userVolume = userDoc.data().volume;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userVolume != null) {
                        document.getElementById("volumeInput").value = userVolume;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    // Get user entered values
    var userName = document.getElementById('nameInput').value;
    var userVolume = document.getElementById('volumeInput').value;

    // Update user's document in Firestore
    currentUser.update({
        name: userName,
        volume: userVolume
    })
        .then(function () {
            console.log("User info updated");

            // Disable edit 
            document.getElementById('personalInfoFields').disabled = true;

            // Alert user when the save is done
            alert("User info saved");
        })
        .catch(function (error) {
            // Handle errors if any
            console.error("Error updating user info: ", error);
            // Inform the user about the error
            alert("Failed to save user info. Please try again later.");
        });
}

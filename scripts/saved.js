//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

//----------------------------------------------------------
// Wouldn't it be nice to see the User's Name on this page?
// Let's do it!  (Thinking ahead:  This function can be carved out, 
// and put into script.js for other pages to use as well).
//----------------------------------------------------------//----------------------------------------------------------
// Function to retrieve the user's name from Firestore based on their UID and update the UI
function insertNameFromFirestore(user) {
    // Accesses the Firestore collection "users" and retrieves the document corresponding to the user's UID
    db.collection("users").doc(user.uid).get().then(userDoc => {

        // Retrieves the user's name from the Firestore document and stores it in the 'userName' variable
        userName = userDoc.data().name;

        // Updates the HTML element with the ID "name-goes-here" to display the user's name in the UI
        document.getElementById("name-goes-here").innerHTML = userName;
    });
}

function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            // Get the Array of bookmarks
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            // Get pointer the new card template
            let newcardTemplate = document.getElementById("savedFountainTemplate");

            // Iterate through the ARRAY of bookmarked fountains (document ID's)
            bookmarks.forEach(thisFountainID => {
                console.log(thisFountainID);
                db.collection("vancouver_drinking_fountains").doc(thisFountainID).get().then(doc => {
                    var title = doc.data().name; // get value of the "name" key
                    var details = doc.data().location; // get value of the "details" key
                    var pet_friendly = doc.data().pet_friendly;
                    var in_operation = doc.data().in_operation;


                    //clone the new card
                    let newcard = newcardTemplate.content.cloneNode(true);

                    //update title and some pertinant information
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-operation-open').innerHTML = "Operating time: " + in_operation;
                    newcard.querySelector('.card-operation-pet').innerHTML = "Pet friendly: " + pet_friendly;
                    newcard.querySelector('.card-text').innerHTML = details;
                    newcard.querySelector('.card-image').src = `./images/water_fountain.jpg`; //Example: NV01.jpg

                    //Finally, attach this new card to the gallery
                    fountainCardGroup.appendChild(newcard);
                })
            });
        })
}

//Global variable pointing to the current user's Firestore document
var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global

            insertNameFromFirestore();
            displayCardsDynamically("vancouver_drinking_fountains");
        } else {
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                var userName = userDoc.data().name;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("waterCardTemplate"); // Retrieve the HTML element with the ID "waterCardTemplate" and store it in the cardTemplate variable. 

    let count = 0; //to show only limited locations

    db.collection(collection).get()   //the collection called "Drinking_water_fountains"
        .then(allWaters => {
            allWaters.forEach(doc => {

                if (count >= 5) {
                    return;
                }

                var title = doc.data().name;
                var details = doc.data().location;
                var petFriendly = doc.data().pet_friendly;
                var inOperation = doc.data().in_operation;
                var fountainImg = doc.data().photo_name;
                var maintainer = doc.data().maintainer;
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-operation-open').innerHTML = "Operating time: " + inOperation;
                newcard.querySelector('.card-operation-pet').innerHTML = "Pet friendly: " + petFriendly;
                newcard.querySelector('.card-text').innerHTML = details;

                if (fountainImg) { // Check if fountainImg is not null or undefined

                    // Conditionally set the image source based on maintainer
                    if (maintainer == "parks") {
                        newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/parks/' + fountainImg;
                    } else if (maintainer == "Engineering") {
                        newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/eng/' + fountainImg;
                    }
                }
                newcard.querySelector('a').href = 'content.html?docID=' + docID;

                newcard.querySelector('i').id = 'save-' + docID; // for assigning unique id to each save button
                newcard.querySelector('i').onclick = () => updateBookmark(docID);

                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;

                    // force to make new bookmark array
                    // currentUser.update({
                    //     bookmarks: firebase.firestore.FieldValue.arrayUnion()
                    // })

                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
                })
                document.getElementById(collection + "-go-here").appendChild(newcard);

                count++;
            })
        })
        .catch(error => {
            console.error('Error displaying cards:', error);
        });
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark() {
    // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
    currentUser.update({
        // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
        // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(fountainDocID)
    })
        // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
        .then(function () {
            console.log("bookmark has been saved for" + fountainDocID);
            var iconID = 'save-' + fountainDocID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}

function updateBookmark(fountainDocID) {
    currentUser.get().then(userDoc => {

        let bookmarks = userDoc.data().bookmarks || [];
        let iconID = "save-" + fountainDocID;
        let isBookmarked = bookmarks.includes(fountainDocID);

        if (isBookmarked) {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(fountainDocID)
            }).then(() => {
                document.getElementById(iconID).innerText = 'bookmark_border';
            })
        } else {
            console.log("cant find bookmark");
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(fountainDocID)
            }).then(() => {
                document.getElementById(iconID).innerText = 'bookmark';
            })
        }
    });
}

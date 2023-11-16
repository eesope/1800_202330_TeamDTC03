function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            insertNameFromFirestore();
            // the following functions are always called when someone is logged in
            displayCardsDynamically("drinking_water_fountains");  //display all water fountains
        } else {
            // No user is signed in.
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
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
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

// function writeWaters() {
//     //define a variable for the collection you want to create in Firestore to populate data
//     var watersRef = db.collection("drinking_water_fountains");

//     watersRef.add({
//         mapid: "DFPB0001",
//         name: "Fountain location: Aberdeen Park",
//         location: "plaza",
//         in_operation: "spring to fall",
//         pet_friendly: "Y", //Y or N
//         geom: { "coordinates": [-123.02723857691211, 49.235052244781656], "type": "Point" },
//         geo_local_area: "Renfrew-Collingwood",
//         geo_point_2d: [49.235052244781656, -123.02723857691211],
//         last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
//     });

//     watersRef.add({
//         mapid: "DFENG0504",
//         name: "Bottle Filling Station location: Kitsilano Pumping Station",
//         location: "North side of sewage pumping station on w/s/ 1300 Arbutus",
//         in_operation: "Year Round",
//         pet_friendly: "N", //Y or N
//         geom: { "coordinates": [-123.1527806, 49.2737142], "type": "Point" },
//         geo_local_area: "Kitsilano",
//         geo_point_2d: [49.2737142, -123.1527806],
//         last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
//     });
//     watersRef.add({
//         mapid: "DFENG0053",
//         name: "Fountain location: Gilford St & Haro St",
//         location: "Gilford mini park",
//         in_operation: "Year Round",
//         pet_friendly: "Y", //Y or N
//         geom: { "coordinates": [-123.138092, 49.291825], "type": "Point" },
//         geo_local_area: "West End",
//         geo_point_2d: [49.291825, -123.138092],
//         last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
//     });
// }



//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("waterCardTemplate"); // Retrieve the HTML element with the ID "waterCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "Drinking_water_fountains"
        .then(allWaters => {
            //var i = 1;  //Optional: if you want to have a unique ID for each location
            allWaters.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().location;  // get value of the "details" key
                var pet_friendly = doc.data().pet_friendly;
                var in_operation = doc.data().in_operation;
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-operation-open').innerHTML = "Operating time: " + in_operation;
                newcard.querySelector('.card-operation-pet').innerHTML = "Pet friendly: " + pet_friendly;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/water_fountain.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "content.html?docID=" + docID;
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
                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

// writeWaters();
// displayCardsDynamically("drinking_water_fountains");  


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

        let bookmarks = userDoc.data().bookmarks;
        let iconID = "save-" + fountainDocID;
        let isBookmarked = bookmarks.includes(fountainDocID);

        if (isBookmarked) {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(fountainDocID)
            }).then(() => {
                document.getElementById(iconID).innerText = 'bookmark_border';
            })
        } else {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(fountainDocID)
            }).then(() => {
                document.getElementById(iconID).innerText = 'bookmark';
            })
        }
    });
}

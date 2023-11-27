



function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            by_pet_friendly("vancouver_drinking_fountains");
        } else {
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}

function by_pet_friendly(collection) {

    console.log("by pet friendly called")

    let cardTemplate = document.getElementById("waterCardTemplate"); // Retrieve the HTML element with the ID "waterCardTemplate" and store it in the cardTemplate variable. 

    let count = 0; //to show only limited locations

    db.collection(collection)
        .where('pet_friendly', '==', 'Y')
        .get()
        .then(allWaters => {
            allWaters.forEach(doc => {

                if (count >= 3) {
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
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
                })

                document.getElementById(collection + "-go-here").innerHTML = "";
                document.getElementById(collection + "-go-here").appendChild(newcard);

                count++;
            })
        })
        .catch(error => {
            console.error('Error displaying cards:', error);
        });
}

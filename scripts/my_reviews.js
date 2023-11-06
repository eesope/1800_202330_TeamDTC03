function addReviews() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("my_reviews");

    hikesRef.add({
        code: "drink1",
        name: "Water fountain #1",
        region: "Downtown",
        comment: "Great water fountain",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hikesRef.add({
        code: "drink2",
        name: "Water fountain #2",
        region: "Mapole Ridge",
        comment: "Great water fountain",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hikesRef.add({
        code: "drink3",
        name: "Water fountain #3",
        region: "China Town",
        comment: "Dirty water fountain",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}

addReviews(); //calling the function

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allHikes => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allHikes.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                //var details = doc.data().details;  // get value of the "details" key
                var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                //var hikeLength = doc.data().length; //gets the length field
                var region = doc.data().region; //gets the region field
                var comment = doc.data().comment; //gets the comment field
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                //newcard.querySelector('.card-length').innerHTML = hikeLength + "km";
                //newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-region').innerHTML = region;
                newcard.querySelector('.card-comment').innerHTML = comment;
                newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "eachHike.html?docID=" + docID;

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("my_reviews");  //input param is the name of the collection


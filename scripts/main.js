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

// calling api from public api



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
                // var waterCode = doc.data().mapid;    //get unique ID to each hike to be used for fetching right image
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

// writeWaters();
displayCardsDynamically("drinking_water_fountains");  //input param is the name of the collection



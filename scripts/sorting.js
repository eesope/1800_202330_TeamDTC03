// for list page
function by_pet() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            by_pet_friendly("sample");
        } else {
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}

// filter pet friendly fountains and show it on list page
function by_pet_friendly(collection) {
    let cardTemplate = document.getElementById("waterCardTemplate");
    // clear the current view
    document.getElementById("vancouver_drinking_fountains-go-here").innerHTML = "";


    db.collection(collection)
        .where('pet_friendly', '==', 'Y')
        .get()
        .then(allWaters => {
            allWaters.forEach(doc => {

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
                    } else {
                        newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/parks/' + docID + '.jpg';
                    }
                }
                newcard.querySelector('a').href = 'content.html?docID=' + docID;

                newcard.querySelector('i').id = 'save-' + docID; // for assigning unique id to each save button
                newcard.querySelector('i').onclick = () => updateBookmark(docID);

                currentUser.get().then(userDoc => {
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
                })

                console.log(allWaters)

                document.getElementById("vancouver_drinking_fountains-go-here").appendChild(newcard);
            })
        })
        .catch(error => {
            console.error('Error displaying cards:', error);
        });
}

// for map page
function map_by_pet() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            map_by_pet_friendly("sample");
        } else {
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}

// filter pet friendly fountains and show it on map
function map_by_pet_friendly(collection) {

    // clear map div
    document.getElementById("map").innerHTML = "";

    // Defines and initiates basic mapbox data
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';

    // Move the map definition to a broader scope
    const map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-123.1207, 49.2827],
        zoom: 10
    });

    // Add user controls to map (compass and zoom) to top left
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    // Listen for when map finishes loading -> add map features 
    map.on('load', () => {
        // Defines map pin icon for events
        map.loadImage(
            'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('eventpin', image);

                const features = []; // Defines an empty array for locations to be added to

                // Clear existing sources and layers
                if (map.getSource('places')) {
                    map.removeLayer('places');
                    map.removeSource('places');
                }

                db.collection(collection)
                    .where('pet_friendly', '==', 'Y')
                    .get()
                    .then(allWaters => {
                        allWaters.forEach(doc => {
                            lat = doc.data().geo_point_2d.lat;
                            lng = doc.data().geo_point_2d.lon;
                            coordinates = [lng, lat];
                            fountainName = doc.data().name;
                            fountainLocation = doc.data().location;
                            operation = doc.data().in_operation;

                            // Pushes information into the features array
                            features.push({
                                'type': 'Feature',
                                'properties': {
                                    'description': `<strong>${fountainName}</strong><p>${fountainLocation}</p> <br> <a href="/content.html?docID=${doc.id}" target="_blank" title="Opens in a new window" style="color:blue;"">See more</a>`
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': coordinates
                                }
                            });
                        });

                        // Adds features as a source of data for the map
                        map.addSource('places', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': features
                            }
                        });

                        // Creates a layer above the map displaying the pins
                        // by using the sources that were just added
                        map.addLayer({
                            'id': 'places',
                            'type': 'symbol',
                            'source': 'places',
                            'layout': {
                                'icon-image': 'eventpin', // Pin Icon
                                'icon-size': 0.1, // Pin Size
                                'icon-allow-overlap': true // Allows icons to overlap
                            }
                        });
                    })
                    .catch(error => {
                        console.error("Error displaying map markers: ", error);
                    });
            }
        );
    });
}

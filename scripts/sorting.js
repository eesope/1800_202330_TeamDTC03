// for list page
function by_pet() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            by_pet_friendly("sample");

            // update the dropdown button 
            document.getElementById('sorting').innerText = 'Pet-friendly';
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


// calculate distance by pythagoras formula
function calculateDistance(userCoords, locationCoords) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = userCoords[1];
    const lon1 = userCoords[0];
    const lat2 = locationCoords[1];
    const lon2 = locationCoords[0];

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // result on Earth in km
    const distance = R * c;
    return distance;
}

function by_distance(userCoords, locations) {
    console.log("by_distance called")
    return locations.sort((location1, location2) => {
        const distance1 = calculateDistance(userCoords, [location1.coordinates[0], location1.coordinates[1]]);
        const distance2 = calculateDistance(userCoords, [location2.coordinates[0], location2.coordinates[1]]);
        return distance1 - distance2;
    });
}

// get user location with javascript
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation
            .getCurrentPosition(showPosition,
                error => {
                    console.error("Error getting location:", error);
                    alert("Error getting location: access not allowed.");
                })
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
// show user location
function showPosition(position) {
    const coordinates = [position.coords.longitude, position.coords.latitude];
    console.log(coordinates)
    return coordinates
}

function displayByDistance(collection) {
    let cardTemplate = document.getElementById("waterCardTemplate"); // Retrieve the HTML element with the ID "waterCardTemplate" and store it in the cardTemplate variable. 

    // Get user's location
    navigator.geolocation.getCurrentPosition(position => {
        const userCoords = [position.coords.longitude, position.coords.latitude];

        document.getElementById("vancouver_drinking_fountains-go-here").innerHTML = "";

        db.collection(collection).get()
            .then(allWaters => {
                // write in array
                const locations = [];

                allWaters.forEach(doc => {
                    const lat = doc.data().geo_point_2d.lat;
                    const lng = doc.data().geo_point_2d.lon;
                    const coordinates = [lng, lat];

                    locations.push({
                        coordinates,
                        fountainName: doc.data().name,
                        fountainLocation: doc.data().location,
                        petFriendly: doc.data().pet_friendly,
                        inOperation: doc.data().in_operation,
                        fountainImg: doc.data().photo_name,
                        maintainer: doc.data().maintainer,
                        docID: doc.id
                    });
                });

                // Sort locations by distance
                const sortedLocations = by_distance(userCoords, locations);

                // Display sorted locations
                sortedLocations.forEach(location => {
                    const newcard = cardTemplate.content.cloneNode(true);

                    // Update title and text and image using properties from the location object
                    newcard.querySelector('.card-title').innerHTML = location.fountainName;
                    newcard.querySelector('.card-operation-open').innerHTML = "Operating time: " + location.inOperation;
                    newcard.querySelector('.card-operation-pet').innerHTML = "Pet friendly: " + location.petFriendly;
                    newcard.querySelector('.card-text').innerHTML = location.fountainLocation;

                    if (location.fountainImg) { // Check if fountainImg is not null or undefined
                        // Conditionally set the image source based on maintainer
                        if (location.maintainer == "parks") {
                            newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/parks/' + location.fountainImg;
                        } else if (location.maintainer == "Engineering") {
                            newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/eng/' + location.fountainImg;
                        } else {
                            newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/parks/' + location.docID + '.jpg';
                        }
                    }

                    newcard.querySelector('a').href = 'content.html?docID=' + location.docID;

                    newcard.querySelector('i').id = 'save-' + location.docID; // for assigning unique id to each save button
                    newcard.querySelector('i').onclick = () => updateBookmark(location.docID);

                    currentUser.get().then(userDoc => {
                        //get the user name
                        var bookmarks = userDoc.data().bookmarks;
                        if (bookmarks.includes(location.docID)) {
                            document.getElementById('save-' + location.docID).innerText = 'bookmark';
                        }
                    })
                    document.getElementById("vancouver_drinking_fountains-go-here").appendChild(newcard);
                });
            })
            .catch(error => {
                console.error('Error displaying cards:', error);
            });
    });
}

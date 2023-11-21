// get user location with javacript
var location_detector = document.getElementById("user_location");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

function showPosition(position) {
    console.log(
        "Latitude: " + position.coords.latitude +
        "\nLongitude: " + position.coords.longitude
    )
}

// get user location with mapbox and show it as area name
function placeGeocoder() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'country,region,place,postcode,locality,neighborhood,address,district'
    });

    geocoder.addTo('#geocoder');

    // Get the geocoder results container.
    const results = document.getElementById('result');

    // Add geocoder result to container.
    geocoder.on('result', (e) => {
        var jsondata = JSON.stringify(e.result, null, 2);
        var data = JSON.parse(jsondata);
        console.log(data);
        var place_name = data["place_name"];
        var place_coord = data["geometry"]["coordinates"];
        results.innerText = place_name + " " + place_coord;  //show it on dom, debug

        //You can save this into local storage for now.  
        //When it is time to Submit the Post you can get the data from Local Storage
        localStorage.setItem("place_name", place_name);
        localStorage.setItem("place_coord", place_coord);
    });

    // Clear results container when search is cleared.
    geocoder.on('clear', () => {
        results.innerText = '';
    });
}

placeGeocoder();
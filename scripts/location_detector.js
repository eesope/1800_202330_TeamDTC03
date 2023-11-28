// get user location with javacript
var location_detector = document.getElementById("detected_location");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
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

    const user_location = document.getElementById('user_location');
    // Add geocoder result to screen
    geocoder.on('user_location', (e) => {
        var jsondata = JSON.stringify(e.user_location, null, 2);
        var data = JSON.parse(jsondata);
        var place_name = data["place_name"];

        console.log(data);
        console.log(place_name)

        user_location.innerText = place_name
        localStorage.setItem("place_name", place_name);
    });

    geocoder.on('clear', () => {
        user_location.innerText = '';
    });
}

placeGeocoder();
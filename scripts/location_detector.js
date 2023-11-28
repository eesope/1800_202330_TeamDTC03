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

function showPosition(position) {
    console.log(
        "Latitude: " + position.coords.latitude +
        "\nLongitude: " + position.coords.longitude
    )
    const coordinates = [position.coords.longitude, position.coords.latitude];
    reverseGeocode(coordinates);
}

function reverseGeocode(coordinates) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';

    // request to Mapbox geocoding API
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?types=country,region,place,postcode,locality,neighborhood,address,district&access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
            // get place name from the response
            const place_name = data.features[0].place_name;
            document.getElementById('detected_location').innerHTML = '';
            document.getElementById('detected_location').innerHTML = place_name;
        }).catch(error => {
            console.error('Error fetching geocoding data:', error);
        });
}

getLocation();
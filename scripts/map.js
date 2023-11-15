function showMap() {
  //------------------------------------------
  // Defines and initiates basic mapbox data
  //------------------------------------------
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
  const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
    center: [123.1207, 49.2827], // Starting position [lng, lat]
    zoom: 10 // Starting zoom
  });

  // Add user controls to map (compass and zoom) to top left
  var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');


  //------------------------------------
  // Listen for when map finishes loading
  // then Add map features 
  //------------------------------------
  map.on('load', () => {

    // Defines map pin icon for events
    map.loadImage(
      'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage('eventpin', image); // Pin Icon

        // READING information from "hikes" collection in Firestore
        db.collection('drinking_water_fountains').get().then(allWaters => {
          const features = []; // Defines an empty array for information to be added to

          allWaters.forEach(doc => {
            lat = doc.data().geom.coordinates[1];
            lng = doc.data().geom.coordinates[0];
            console.log(lat, lng);
            coordinates = [lng, lat];
            console.log(coordinates);
            // Coordinates
            event_name = doc.data().name; // Event Name
            preview = doc.data().location; // Text Preview
            operation = doc.data().in_operation;
            // img = doc.data().posterurl; // Image
            // url = doc.data().link; // URL

            // Pushes information into the features array
            // in our application, we have a string description of the hike
            features.push({
              'type': 'Feature',
              'properties': {
                'description': `<strong>${event_name}</strong><p>${preview}</p> <br> <a href="/content.html?id=${doc.id}" target="_blank" title="Opens in a new window">Read more</a>`
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
          // by using the sources that was just added
          map.addLayer({
            'id': 'places',
            'type': 'symbol',
            // source: 'places',
            'source': 'places',
            'layout': {
              'icon-image': 'eventpin', // Pin Icon
              'icon-size': 0.1, // Pin Size
              'icon-allow-overlap': true // Allows icons to overlap
            }
          });

          //-----------------------------------------------------------------------
          // Add Click event listener, and handler function that creates a popup
          // that displays info from "hikes" collection in Firestore
          //-----------------------------------------------------------------------
          map.on('click', 'places', (e) => {
            // Extract coordinates array.
            // Extract description of that place
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          });

          //-----------------------------------------------------------------------
          // Add mousenter event listener, and handler function to 
          // Change the cursor to a pointer when the mouse is over the places layer.
          //-----------------------------------------------------------------------
          map.on('mouseenter', 'places', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          // Defaults cursor when not hovering over the places layer
          map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
          });
        });
      }
    );

    // Add the image to the map style.
    map.loadImage(
      'https://cdn-icons-png.flaticon.com/512/61/61168.png',
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style with width and height values
        map.addImage('userpin', image, { width: 10, height: 10 });

        // Adds user's current location as a source to the map
        navigator.geolocation.getCurrentPosition(position => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          console.log(userLocation);
          if (userLocation) {
            map.addSource('userLocation', {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': [{
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': userLocation
                  },
                  'properties': {
                    'description': 'Your location'
                  }
                }]
              }
            });

            // Creates a layer above the map displaying the user's location
            map.addLayer({
              'id': 'userLocation',
              'type': 'symbol',
              'source': 'userLocation',
              'layout': {
                'icon-image': 'userpin', // Pin Icon
                'icon-size': 0.05, // Pin Size
                'icon-allow-overlap': true // Allows icons to overlap
              }
            });

            // Map On Click function that creates a popup displaying the user's location
            map.on('click', 'userLocation', (e) => {
              // Copy coordinates array.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the userLocation layer.
            map.on('mouseenter', 'userLocation', () => {
              map.getCanvas().style.cursor = 'pointer';
            });

            // Defaults
            // Defaults cursor when not hovering over the userLocation layer
            map.on('mouseleave', 'userLocation', () => {
              map.getCanvas().style.cursor = '';
            });
          }
        });
      }
    );
  });

  // declare some globally used variables
  var userLocationMarker;
  var searchLocationMarker;
  var userLocation;
  var searchLocation;

  // Get the user's location
  navigator.geolocation.getCurrentPosition(function (position) {
    userLocation = [position.coords.longitude, position.coords.latitude];
    console.log(userLocation);
    console.log(searchLocation);

    // Add a marker to the map at the user's location
    userLocationMarker = new mapboxgl.Marker()
      .setLngLat(userLocation)
      .addTo(map);

    // Center the map on the user's location
    map.flyTo({
      center: userLocation
    });
  });

  // Add the MapboxGeocoder search box to the map
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  });
  map.addControl(geocoder);

  // Listen for the 'result' event from the geocoder (when a search is made)
  geocoder.on('result', function (e) {
    searchLocation = e.result.geometry.coordinates;
    console.log(userLocation);
    console.log(searchLocation);

    // Add a marker to the map at the search location
    searchLocationMarker && searchLocationMarker.remove(); // Remove the previous search marker if it exists
    searchLocationMarker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(searchLocation)
      .addTo(map);

    // Fit the map to include both the user's location and the search location
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(userLocation);
    bounds.extend(searchLocation);

    map.fitBounds(bounds, {
      padding: {
        top: 100,
        bottom: 50,
        left: 100,
        right: 50
      } // Add some padding so that markers aren't at the edge or blocked
    });
  });
}

showMap();
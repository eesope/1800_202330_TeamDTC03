function showMap() {

  // Defines and initiates basic mapbox data
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
  const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
    center: [-123.1207, 49.2827], // Starting position [lng, lat]
    zoom: 10 // Starting zoom
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

        // set counting only 5 locations to prevent exceeding firestore quota
        let count = 0;

        // READING information from db in Firestore
        db.collection('vancouver_drinking_fountains').get().then(allWaters => {
          const features = []; // Defines an empty array for information to be added to

          allWaters.forEach(doc => {

            if (count >= 5) {
              return;
            }

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

            count++;
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
            'source': 'places',
            'layout': {
              'icon-image': 'eventpin', // Pin Icon
              'icon-size': 0.1, // Pin Size
              'icon-allow-overlap': true // Allows icons to overlap
            }
          });

          //-----------------------------------------------------------------------
          // Add Click event listener, and handler function that creates a popup
          // that displays info from db in Firestore
          //-----------------------------------------------------------------------
          map.on('click', 'places', (e) => {

            const id = e.features[0].properties.id;

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

    // Add the image/icon to the map
    map.loadImage(
      'https://cdn-icons-png.flaticon.com/512/61/61168.png',
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style with width and height values
        map.addImage('userpin', image, { width: 10, height: 10 });

        // Adds user's current location as a source to the map
        navigator.geolocation.getCurrentPosition(position => {
          const userLocation = [position.coords.longitude, position.coords.latitude];

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
  var searchLocationMarker;
  var userLocation;
  var searchLocation;

  // Get the user's location
  navigator.geolocation.getCurrentPosition(function (position) {
    userLocation = [position.coords.longitude, position.coords.latitude];

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

  // Listen for searching from the geocoder
  geocoder.on('result', function (e) {
    searchLocation = e.result.geometry.coordinates;

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
// Replace with your Mapbox Access Token
    mapboxgl.accessToken =  mapToken;

    // Create map instance
    var map = new mapboxgl.Map({
        container: 'map', // ID of the div where the map will be displayed
        style: 'mapbox://styles/mapbox/streets-v11', // Map style
        center: listing.geometry.coordinates , // Initial center coordinates [longitude, latitude]
        zoom: 11 // Initial zoom level
    });


    // Add a marker (Optional)
    var marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // Set marker coordinates [longitude, latitude]
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // Add popup to marker
            .setHTML(`<h4>${listing.location}</h4><p>Exact location after booking</p>`)
    )
    .addTo(map);


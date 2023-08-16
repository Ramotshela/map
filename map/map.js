let map, directionsService, directionsRenderer,searchInput;
const locations = [
    { lat: -23.886540050870934, lng: 29.742765302846774, name: 'language lab' },
    { lat: -23.886586767608808, lng: 29.74110478361676, name: 'maths building' },
    // Add more locations as needed
];

function initMap() {
    // Initial coordinates for your campus
    let campusLatLng = { lat: -23.8860, lng: 29.7380 };

    // Create a map centered on the campus
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: campusLatLng
    });

    // Create a marker for the campus location
    //    let campusMarker = new google.maps.Marker({
    //         position: campusLatLng,
    //         map: map,
    //         title: 'Campus'
    //     });

    // Example locations around campus
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        panel: document.getElementById('directions-panel')
    });

 searchInput = document.getElementById('search-input');
    const searchBox = new google.maps.places.SearchBox(searchInput);

    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        calculateAndDisplayRoute({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    });
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name
        });

        marker.addListener('click', () => {
            calculateAndDisplayRoute(location);
        });
    });
}
initMap()

function calculateAndDisplayRoute(destination) {
    const campusLatLng = new google.maps.LatLng(-23.8860, 29.7380); // Campus location

    const request = {
        origin: campusLatLng, // Starting point is the campus location
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING // Change travel mode as needed
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

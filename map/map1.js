 

const mapData = [
    { lat: -23.886540050870934, lng: 29.742765302846774, name: 'language lab' },
    { lat: -23.886586767608808, lng: 29.74110478361676, name: 'maths building' },
    { lat: -23.887697625088844, lng: 29.739435793374966, name: 'Library' },
    { lat: -23.887604889400254, lng: 29.7410217815189, name: 'TA Hall' },
    { lat: -23.887580561355268, lng: 29.741036625980566, name: 'TB HALL' },
    { lat: -23.887387154793032, lng: 29.74096775727328, name: 'TC HALL' },
    { lat: -23.887679513438087, lng: 29.740323342940798, name: 'R Block' },
    { lat: -23.886308451596967, lng: 29.74132313483029, name: 'Faculty Of Science And Agriculture' },
    { lat: -23.885998001194917, lng:  29.740391550993397, name: 'Q Block' },
    { lat: -23.8864352750917, lng: 29.74110689259921, name: 'B.Sc Molecular and Life Science' },

];  

  function initMap() {
    
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -23.8860, lng: 29.7380 },
        zoom: 15,
    });
    const modeSelector = document.getElementById("mode");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const input = document.getElementById("pac-input");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();

      if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
      }

      if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
      } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent = place.formatted_address;
      infowindow.open(map, marker);

      // Calculate and display directions to the selected marker
      calculateAndDisplayRoute(directionsService, directionsRenderer, place.geometry.location);
  });
    // Get the user's live location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
  
          // Create a marker for the user's location
          const userMarker = new google.maps.Marker({
            position: { lat: userLat, lng: userLng },
            map: map,
            title: "Your Location",
            icon: "../map/", // Customize with your icon path
          });
  
          // Calculate distances and display info windows
      
            mapData.forEach(location => {
              const marker = new google.maps.Marker({
                  position: { lat: location.lat, lng: location.lng },
                  map: map,
                  title: location.name,
              });
      
              marker.addListener("click", () => {
                  // Use the marker's location as the destination
                  calculateAndDisplayRoute(directionsService, directionsRenderer, marker.getPosition());
              });
          });
        },
        error => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
    let filteredAutocompleteResults = [];

    // Function to filter autocomplete results
    function filterAutocompleteResults(predictions) {
        filteredAutocompleteResults = predictions.filter(prediction => {
            const placeLocation = prediction.geometry.location;
            return mapData.some(location => {
                const markerLocation = new google.maps.LatLng(location.lat, location.lng);
                const distance = google.maps.geometry.spherical.computeDistanceBetween(placeLocation, markerLocation);
                return distance <= 1000; // Filter within 1000 meters (adjust as needed)
            });
        });
    }
  }
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  function calculateAndDisplayRoute(directionsService, directionsRenderer, destination) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const selectedMode = document.getElementById("mode").value;

                const request = {
                    origin: { lat: userLat, lng: userLng },
                    destination: destination, // Use the provided destination
                    travelMode: google.maps.TravelMode[selectedMode],
                };

                directionsService.route(request, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);
                    } else {
                        window.alert("Directions request failed due to " + status);
                    }
                });
            },
            error => {
                console.error("Error getting user's location:", error);
            }
        );
    } else {
        console.error("Geolocation not supported by this browser.");
    }
}
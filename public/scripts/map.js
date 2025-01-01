mapboxgl.accessToken = mapToken;

// Initialize the map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  center: coordinates,
  zoom: 11,
});

console.log(coordinates);

// Create a custom Airbnb-style marker
const customMarker = document.createElement("div");
customMarker.className = "airbnb-marker";
customMarker.innerHTML = `
<div class="marker-highlight"></div> <!-- Highlight circle -->

<svg xmlns="http://www.w3.org/2000/svg" width="60" height="70" viewBox="0 0 24 24" class="default-marker">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0, 0, 0, 0.3)" />
      </filter>
    </defs>
    <path d="M12 2C8.134 2 5 5.134 5 9c0 2.86 1.274 4.89 3.04 7.065C9.451 17.543 10 19 10 19h4s.549-1.457 1.96-2.935C17.726 13.89 19 11.86 19 9c0-3.866-3.134-7-7-7z" fill="#ff5a5f" filter="url(#shadow)" />
    <circle cx="12" cy="9" r="3" fill="white" />
  </svg> 
  <span>₹${price}</span>`; // Example price

// Add the marker to the map
new mapboxgl.Marker({ element: customMarker })
  .setLngLat(coordinates)
  .addTo(map);

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

// 2nd method
// // Function to initialize the map
// function initializeMap(mapToken, coordinates) {
//     // Set Mapbox access token
//     mapboxgl.accessToken = mapToken;

//     // Initialize the map
//     const map = new mapboxgl.Map({
//       container: "map", // The ID of the container element
//       style: "mapbox://styles/mapbox/streets-v11", // Map style URL
//       center: coordinates, // Starting position [longitude, latitude]
//       zoom: 10, // Starting zoom level
//     });

//     // Add a marker
//     new mapboxgl.Marker()
//       .setLngLat(coordinates) // Coordinates for the marker
//       .addTo(map);

//     // Add zoom and rotation controls
//     map.addControl(new mapboxgl.NavigationControl());
//   }

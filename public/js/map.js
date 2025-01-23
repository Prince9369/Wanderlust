mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v11", // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10, // starting zoom
});

const marker = new mapboxgl.Marker({color: 'red', scale: 1.5})
    .setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
        `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
    )//marker pr click krne pr popup
)
    .addTo(map);

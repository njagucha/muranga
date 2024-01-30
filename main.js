let map = L.map("map", {
  center: [-0.82, 37.17],
  zoom: 11,
});

let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy: OpenStreetMap",
}).addTo(map);

let esriImagery = L.tileLayer(
  "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, 
	IGN, IGP, UPR-EGP, and the GIS User Community`,
  }
);

let basemaps = {
  OpenStreetMap: osm,
  "ESRI World Imagery": esriImagery,
};

fetch("data/hospitals.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        let hospitalIcon = L.icon({
          iconUrl: "img/medical.png",
          iconSize: [38, 35],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
        });
        return L.marker(latlng).setIcon(hospitalIcon);
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(
          `<div> 
             <p><span class="popup">NAME:</span> ${
               feature.properties.F_NAME
             }</p>
             <p><span class="popup">SUB COUNTY:</span> ${feature.properties.Sub_County.toUpperCase()}</p>
             <p><span class="popup">EMERGENCY CONTACT:</span> ${
               feature.properties.Contacts
             }</p>
            </div>
        `
        );
      },
    }).addTo(map);
  });

L.control.layers(basemaps).addTo(map);

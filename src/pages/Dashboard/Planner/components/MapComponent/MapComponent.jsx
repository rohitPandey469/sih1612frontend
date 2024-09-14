import { FeatureGroup, MapContainer, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useRef, useState } from "react";
import { EditControl } from "react-leaflet-draw";
import osm from "./osm-providers";
import * as turf from "@turf/turf"

// example data
const routes = [
  {
    id: 1,
    name: "Route 1",
    coordinates: [
      [37.7749, -122.4194], // San Francisco
      [37.7849, -122.4094], // Stop
      [37.7949, -122.3994], // Stop
      [37.8049, -122.3894], // End Point
    ],
    color: "blue",
  },
  {
    id: 2,
    name: "Route 2",
    coordinates: [
      [37.8049, -122.3894], // Start Point
      [37.8149, -122.3794], // Stop
      [37.8249, -122.3694], // Stop
      [37.8349, -122.3594], // End Point
    ],
    color: "green",
  },
  {
    id: 3,
    name: "Route 3",
    coordinates: [
      [37.7749, -122.4194], // Start Point
      [37.7649, -122.4294], // Stop
      [37.7549, -122.4394], // End Point
    ],
    color: "red",
  },
];

const MapComponent = () => {
  const mapRef = useRef();
  const [mapRoutes, setMapRoutes] = useState(routes);
  const [highlightedRoutes, setHighlightedRoutes] = useState([]);

  // Add
  const onCreate = (e) => {
    const newRoute = e.layer.toGeoJSON();
    const latlngs = newRoute.geometry.coordinates.map((latlng) => [
      latlng[1],
      latlng[0],
    ]);

    // Detect opverlap and populate the highlighted Route state
    const newRouteLine = turf.lineString(latlngs)

    const newId = mapRoutes.length + 1;
    const newRouteObj = {
      id: newId,
      name: `Route ${newId}`,
      coordinates: latlngs,
      color: "blue",
    };

    setMapRoutes([...mapRoutes, newRouteObj]);
    ////////////Send the changes to the backend
    console.log("Newly Created Routes : ", [...mapRoutes, newRouteObj]);
  };

  // Edit
  const onEdit = (e) => {
    //****************Problem**********///
    const editedLayers = e.layers;
    let updatedRoutes = [...mapRoutes];

    editedLayers.eachLayer((layer) => {
      const updatedRoute = layer.toGeoJSON();
      const latlngs = updatedRoute.geometry.coordinates.map((latlng) => [
        latlng[1],
        latlng[0],
      ]);

      const routeId = updatedRoutes.findIndex((route) =>
        route.coordinates.some((coord) => coord[0] === latlngs[0][0])
      );

      if (routeId !== -1) {
        updatedRoutes[routeId].coordinates = latlngs;
      }
    });

    setMapRoutes(updatedRoutes);
    console.log("Updated Routes : ", updatedRoutes);
  };

  return (
    <MapContainer
      center={[37.7749, -122.4194]}
      zoom={13}
      scrollWheelZoom={false}
      ref={mapRef}
      style={{ height: "100vh", width: "100%" }}
    >
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreate}
          onEdited={onEdit}
          draw={{
            polyline: true, // Enable drawing polylines for routes
            polygon: false,
            circle: false,
            rectangle: false,
            marker: false,
          }}
        />
      </FeatureGroup>
      <TileLayer
        attribution={osm.openstreetmap.attribution}
        url={osm.openstreetmap.url}
      />

      {routes.map((route, idx) => (
        <Polyline key={idx} positions={route.coordinates} color={route.color} />
      ))}
    </MapContainer>
  );
};

export default MapComponent;

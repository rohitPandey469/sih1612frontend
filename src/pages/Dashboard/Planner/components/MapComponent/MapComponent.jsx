import {
  FeatureGroup,
  MapContainer,
  Polygon,
  Polyline,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useRef, useState } from "react";
import { EditControl } from "react-leaflet-draw";
import osm from "./osm-providers";
import * as turf from "@turf/turf";

const bufferDistance = 0.5; //km

//city boundary
const cityBoundary = [
  [-122.5, 37.7],
  [-122.5, 37.85],
  [-122.35, 37.85],
  [-122.35, 37.7],
  [-122.5, 37.7],
];

// example rotes data {latitude, longtitude}
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
  const [existingRoutes, setExistingRoutes] = useState(routes); //keep on pulling data from backend
  const [highlightedRoutes, setHighlightedRoutes] = useState([]);
  const [coverage, setCoverage] = useState(null);
  const [serviceCoveragePercentage, setServiceCoveragePercentage] = useState(0);

  // Helper - check for overlaps
  const checkOverlap = (newRouteCoords) => {
    const newRouteLine = turf.lineString(newRouteCoords);
    const overlappingRoutes = existingRoutes.filter((route) => {
      const existingRouteLine = turf.lineString(route.coordinates);

      const isOverlap = turf.booleanOverlap(newRouteLine, existingRouteLine);
      const isIntersect =
        turf.lineIntersect(newRouteLine, existingRouteLine).features.length > 0;

      return isOverlap || isIntersect;
    });

    return overlappingRoutes;
  };

  // Helper - calculate service coverage
  const calculateCoverage = () => {
    const cityPolygon = turf.polygon([cityBoundary]);

    // Create a multiPolygon for the route buffers
    const buffers = existingRoutes.map((route) => {
      const routeLine = turf.lineString(route.coordinates);
      return turf.buffer(routeLine, bufferDistance, { units: "kilometers" });
    });

    const multiPolygon = turf.featureCollection(buffers);

    // Calculate the intersection of the buffers with the city boundary
    const intersection = turf.intersect(multiPolygon, cityPolygon);
    console.log("City Polygon:", cityPolygon);
    console.log("Route Buffers:", multiPolygon);
    console.log("Intersection:", intersection);
    if (intersection) {
      // Calculate the area covered by the routes
      const coverageArea = turf.area(intersection);
      const cityArea = turf.area(cityPolygon);

      // Calculate the percentage of coverage
      const percentage = (coverageArea / cityArea) * 100;
      setServiceCoveragePercentage(percentage.toFixed(2));
      setCoverage(intersection);
    } else {
      setServiceCoveragePercentage(0);
      setCoverage(null);
    }
  };

  // Add
  const onCreate = (e) => {
    const newRoute = e.layer.toGeoJSON();
    const latlngs = newRoute.geometry.coordinates.map((latlng) => [
      latlng[1],
      latlng[0],
    ]);

    // Detect opverlaps
    const overlappingRoutes = checkOverlap(latlngs);
    console.log("Overlapping Routes :", overlappingRoutes);

    // Handle Overlaps
    if (overlappingRoutes.length > 0) {
      setHighlightedRoutes(overlappingRoutes);
      console.log("Overlap detected with routes : ", overlappingRoutes);
      // toast.error("Overlapping routes")
    } else {
      const newId = existingRoutes.length + 1;
      const newRouteObj = {
        id: newId,
        name: `Route ${newId}`,
        coordinates: latlngs,
        color: "blue",
      };

      setExistingRoutes([...existingRoutes, newRouteObj]);
      ////////////Send the changes to the backend
      // toast.success("New Route Created Successfully")
      console.log("Newly Created Routes : ", [...existingRoutes, newRouteObj]);
    }
  };

  // Edit
  const onEdit = (e) => {
    //****************Problem**********///
    const editedLayers = e.layers;
    let updatedRoutes = [...existingRoutes];

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

    setExistingRoutes(updatedRoutes);
    console.log("Updated Routes : ", updatedRoutes);
  };

  // Trigger the coverage calculation when routes change
  useState(() => {
    calculateCoverage();
  }, [existingRoutes]);

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

      <Polygon positions={cityBoundary} color="black" />

      {existingRoutes.map((route, idx) => (
        <Polyline
          key={idx}
          positions={route.coordinates}
          color={route.color}
          opacity={0.7}
        />
      ))}
      {highlightedRoutes.map((route, idx) => (
        <Polyline
          key={`highlighted-${idx}`}
          positions={route.coordinates}
          color="#FFD700"
          weight={5}
          opacity={1}
          dashArray="5,10"
          dashOffset="5"
          shadowBlur={15}
          shadowColor="#FFD700"
        />
      ))}

      {/* {coverage && (
        <Polygon
          positions={coverage.geometry.coordinates[0]}
          color="orange"
          fillOpacity={0.5}
        />
      )}

      <div className="service-coverage">
        <h4>Service Coverage: {serviceCoveragePercentage}%</h4>
      </div> */}
    </MapContainer>
  );
};

export default MapComponent;

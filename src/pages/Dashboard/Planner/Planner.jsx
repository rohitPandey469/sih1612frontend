/*
UI Sections:
Route Management Panel:
Features:
Basic GIS-based route viewer (no advanced metrics).
Simple drag-and-drop functionality to create new routes and a highlight system for overlaps.
Working: Display current routes and allow the user to add new routes with basic overlap detection.
Minimal Route Metrics Panel:
Show only the most critical data points, such as congestion and service coverage percentages.
 */

import { useEffect, useState } from "react";
import MapComponent from "./components/MapComponent/MapComponent";
import SearchBar from "./components/MapComponent/SearchBar";
import ShowInfo from "./components/MapComponent/ShowInfo";
import MetricsInfo from "./components/MapComponent/MetricsInfo";
import StatusBox from "./components/MapComponent/StatusBox";

const bufferDistance = 0.5; //km

//city boundary - done for metrics calculation
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

const Planner = () => {
  const [highlightedRoute, setHighlightedRoute] = useState([]);
  const setHighlightedRouteFunc = (route) => {
    setHighlightedRoute(route);
  };
  return (
    <div style={{ width: "100vw", display: "flex" }}>
      <div style={{ border: "2px solid red", width: "65%" }}>
        <SearchBar
          routes={routes}
          setHighlightedRouteFunc={setHighlightedRouteFunc}
        />
        <MapComponent
          routes={routes}
          cityBoundary={cityBoundary}
          bufferDistance={bufferDistance}
          highlightedRoute={highlightedRoute}
        />
      </div>
      <div style={{ border: "2px solid green", width: "35%" }}>
        <ShowInfo route={highlightedRoute} />
        <MetricsInfo/>
        <StatusBox/>
      </div>
    </div>
  );
};

export default Planner;

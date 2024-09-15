import React from "react";

const ShowInfo = ({ route }) => {
  return (
    <div key={route.id} style={{ border: "2px solid blue" }}>
      <h2>{route.name}</h2>
      <h2>Passengers broading the route</h2>
      <h2>Traffic Patterns</h2>
      <h2>Congestion Percentage</h2>
    </div>
  );
};

export default ShowInfo;

import React, { useState, useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({ routes, setHighlightedRouteFunc }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      const result = routes.filter((route) => {
        const regex = new RegExp(searchTerm, "gi");
        return route.name.match(regex);
      });
      setFilteredRoutes(result);
    } else {
      setFilteredRoutes([]);
    }
  }, [searchTerm, routes]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const displayMatches = (matches) => {
    return matches.map((route) => {
      const regex = new RegExp(searchTerm, "gi");
      const routeName = route.name.replace(
        regex,
        (match) => `<span style="background:#49aeff">${match}</span>`
      );
      return (
        <li key={route.id}>
          <span
            className="name"
            dangerouslySetInnerHTML={{ __html: routeName }}
          ></span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setHighlightedRouteFunc(route);
            }}
          >
            Click to view
          </button>
        </li>
      );
    });
  };

  return (
    <form action="" className="search-form">
      <input
        type="text"
        className="search"
        placeholder="Search Route"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul className="suggestions">
        {searchTerm ? (
          displayMatches(filteredRoutes)
        ) : (
          <>
            {/* <li>Filter for a route</li>
            <li>or select one from the list</li> */}
          </>
        )}
      </ul>
    </form>
  );
};

export default SearchBar;

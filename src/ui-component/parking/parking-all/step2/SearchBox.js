import React, { useRef, useState } from "react";
import { Divider, Input } from "@mui/material";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBox(props) {
  const { setSearchResult } = props;
  const [inputActive, setInputActive] = useState(false);
  const address = localStorage.getItem("address") || "";

  const [searchText, setSearchText] = useState(address);

  const mapRef = useRef();

  const inputStyles = {
    width: "100%",
    marginRight: "10px",
    borderRadius: "24px",
    background: "#fff",
    border: "none",
    "&:focus": {
      outline: "none",
    },
  };

  const searchButtonStyles = {
    boxShadow: "none",
    color: "#333333c7",
    backgroundColor: "transparent",
    minWidth: "50px",
    "&:hover": {
      backgroundColor: "transparent",
      // color: '#000',
    },
    "&.active": {
      color: "#000",
    },
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
    setInputActive(event.target.value !== "");
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchText}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        setSearchResult(result);
        const { lat, lon } = result;
        const map = mapRef.current;
        if (map) {
          map.flyTo([lat, lon], 18, {
            duration: 2,
          });
        }
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "2.5em",
        padding: "5px 0px 5px 10px",
      }}
    >
      <Input
        sx={inputStyles}
        disableUnderline
        // style={{
        //   width: "100%",
        //   marginRight: "10px",
        //   borderRadius: "24px",
        //   background: "#fff",
        //   border: "none",
        // }}
        placeholder="Tìm bãi xe của bạn"
        value={searchText}
        onChange={handleInputChange}
        onFocus={() => setInputActive(true)}
        onBlur={() => setInputActive(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Divider orientation="vertical" flexItem />
      <Button
        sx={`${searchButtonStyles} ${inputActive ? "active" : ""}`}
        onClick={handleSearch}
      >
        <SearchIcon />
      </Button>
    </div>
  );
}

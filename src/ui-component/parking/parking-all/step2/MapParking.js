import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "./placeholder.png",
  iconSize: [38, 38],
});

const position = [10.80122, 106.7937];

export default function MapParking(props) {
  const { searchResult, setSearchResult, markerPosition, setMarkerPosition } =
    props;

  const mapRef = useRef();

  const handleMapClick = (e) => {
    setMarkerPosition([e.latlng.lat, e.latlng.lng]);
    setSearchResult(null);
  };

  useEffect(() => {
    if (searchResult) {
      setMarkerPosition([searchResult.lat, searchResult.lon]);
      const { lat, lon } = searchResult;
      const map = mapRef.current;
      if (map) {
        map.flyTo(
          [lat, lon],
          18,
          {
            duration: 2,
          },
          map.getZoom(),
          {
            animate: true,
          }
        );
      }
    } else {
      setMarkerPosition(null);
    }
  }, [searchResult]);

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ width: "100%", height: "100%" }}
      ref={mapRef}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=5N4WkwdSs34jdmDsg2lc"
      />
      {searchResult && (
        <Marker position={[searchResult.lat, searchResult.lon]}>
          <Popup>{searchResult.display_name}</Popup>
        </Marker>
      )}
      {markerPosition && (
        <Marker position={markerPosition} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
      <SearchBar handleSetMarker={handleMapClick} />
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}

function SearchBar({ handleSetMarker }) {
  useMapEvent("click", handleSetMarker);

  return null;
}

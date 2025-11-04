import React from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const icon = L.icon({
  iconUrl: "./placeholder.png",
  iconSize: [38, 38],
});

const ParkingLocation = ({ markerPosition }) => {
  return (
    <>
      <MapContainer
        zoom={18}
        center={markerPosition}
        style={{ width: "60%", height: "60%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=5N4WkwdSs34jdmDsg2lc"
        />
        {markerPosition !== "undefined" ? (
          <Marker position={markerPosition} icon={icon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ) : (
          <></>
        )}
      </MapContainer>
    </>
  );
};

export default ParkingLocation;

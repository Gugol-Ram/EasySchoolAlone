// import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import iconRetinaUrl from "../../../node_modules/leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "../../../node_modules/leaflet/dist/images/marker-icon.png";
import shadowUrl from "../../../node_modules/leaflet/dist/images/marker-shadow.png";

import styles from "./Maps.module.css";
//ícono por defecto
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
// });
const customIcon = new L.Icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const center = [-31.41967182069668, -64.18831146585843];

const Maps = () => {
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Maps;

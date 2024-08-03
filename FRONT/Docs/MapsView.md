# Mapa interactivo, utilizando LeaFlet

Instalamos la dependencia:`npm install leaflet react-leaflet`

Creamos un componente encargado de renderizar el mapa: `src/components/Maps/MapsView.jsx`

Y en el mismo importamos lo necesario de la libreria de leaflet para poder renderizar el mapa

```
// src/components/MapsView/MapsView.jsx

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import styles from "./Maps.module.css";

//Pin por defecto
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
// });

// Pin perzonalizado
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
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center} icon={customIcon}>
          <Popup>
            Nos puedes encontrar <strong>Aquí</strong>. <br /> 09:00 a 18:00hs.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Maps;

```

En caso de que no se renderize correctamente el pin(bug que tuve, luego se solucionó sin más) podemos crear el ícono de la siguiente forma:

```
// Crear un ícono personalizado
const customIcon = new L.Icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
```

en nuestra constante `center`indicamos la coordenada objetivo del lugar. Y en `Popup`podemos colocar un pequeño mensaje que consideremos necesario al clickear el Pin.

Exportamos dicho componente para requerirlo en el componente de MainHome(en este caso). Sólo requerimos importarlo y colocarlo en el lugar del render que consideremos conveniente(considerar que es posible tener que ajustar css tanto del componente home como del propio maps.)

```
...
import Maps from "../MapsView/MapsView";

function MainHome() {
  return (
    ...
        <div>
          <h2>¿Donde Estamos?</h2>
            <p>
              Actualmente nos ubicamos en la ciudad de Córdoba, barrio de Nva
              Córdoba
            </p>
              <Maps />
        </div>
    ...
  );
 }
```

Agregamos un archivo para un estilado sencillo, recuadro sombreado y centrado etc.

```
/* src/components/Maps/Maps.module.css */

.mapContainer {
  width: 800px;
  height: 400px; /* Puedes ajustar esta altura según tus necesidades */
  margin: 0 auto; /* Para centrar el mapa horizontalmente */
  border: solid #094195; /* Opcional: agregar un borde */
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Opcional: agregar sombra */
  margin-bottom: 20px;
}

```

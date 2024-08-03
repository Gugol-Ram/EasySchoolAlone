# ERROR CORS

## Solicitud de origen cruzado bloqueada

En algún momento de los retoques algo provocó un fallo bastante importante ya que dejó de responder correctamente la pagina y mirando la consola del navegador obtuve errores respecto al CORS con mensajes como el siguiente:

`Solicitud de origen cruzado bloqueada: La misma política de origen no permite la lectura de recursos remotos en http://localhost:3000/parents/null. (Razón: Solicitud CORS sin éxito). Código de estado: (null).`

Apoyado en chat GPT se intentaron algunas modificaciones(sin éxito) del lado del servidor, puntualmente en mi archivo `server.js`(básicamente se agrego `corsOptions`)

```
const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

server.use(morgan("dev"));
server.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173', // Cambia esto según sea necesario para tu entorno de producción
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permitir el envío de cookies con la solicitud
};

server.use(cors(corsOptions));

server.use(router);

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

module.exports = server;

```

Y respecto al comienzo de la solicitud en el lado del cliente (`Login.jsx`) una modificación menor para enviar cookies en la solicitud:

```
const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${VITE_BACK_URL}/login`, loginData, {
      withCredentials: true, // Importante para enviar cookies
    });
    const { token } = response.data;
    ...}
    ...}
```

Siguió sin funcionar por lo que opté por eliminar mi DB y crear una nueva y con distinto nombre.

Esto **si** funcionó, la página volvió a responder correctamente pero ahora tenía definido una ruta específica (estática) del cliente en mi archivo `server.js` por lo que no era lo óptimo.

Si volvía a como estaba mi `server.js` entonces ahora volvía el error CORS pero con el siguiente mensaje:

`Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is '\*'`

Por lo que la respuesta a esto último estuvo en la documentacion de Mozilla que sugería lo siguiente:

```
    If using the Fetch API, make sure Request.credentials is "omit".
    If the request is being issued using XMLHttpRequest, make sure you're not setting withCredentials to true.
    If using Server-sent events, make sure EventSource.withCredentials is false (it's the default value).
```

Así que se volvió a desactivar el envió de cookies en `Login.jsx`y parece funcionar correctamente.

Como conclusión, no obtuve certeza de donde se originó dicho error ya que -en principio- volví al código como estaba inicialemente, y el error se eliminó, eliminando la DB y creando otra.

Futuros updates al respecto aquí...💭

a
a
a

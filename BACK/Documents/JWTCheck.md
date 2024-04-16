# Json Web Token(JWT)

Será nuestro token encargado de autenticar a los usuarios en nuestra pagina, para mantener cierta persistencia de los datos.

Este código utilizado en nuestro archivo .env es un codigo aleatorio generado por nosotros mismos, para hacer el encriptado. Se pueden utilizar paginas cómo `https://www.lastpass.com/es/features/password-generator#generatorTool` en el que podemos personalizar cantidad o tipo de carácteres etc.(Básicamente es un generador de contraseñas, ya que el secret sería eso, una contraseña para generar otra nueva xD)

Este Secret sera el encargado de generar el token aleatorio para el usuario.

## Controller

Requerimos a jwt y creamos una fn que se encargue de autenticar si ese token es válido.

```
const jwt = require("jsonwebtoken");

function authenticateToken(req, res) {
  const token = req.header("Authorization");
  console.log("token: ", token);
  if (!token)
    return res
      .status(401)
      .json({ message: "No se proporcionó un token de autenticación." });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token de autenticación inválido o caducado." });
    } else {
      res.json({ user });
    }
  });
}

module.exports = {
  authenticateToken,
};

```

Por el header tomamos la 'autorización', en caso de no haber token devolvemos un error respectivo.

Mediante el método verify de jwt tomamos el token que nos esta llegando y lo comaparamos con el almacenado por nosotros en nuestro archivo .env, si hay error lo manejamos adecuadamente devolviendo un mensaje representativo, y si es correcto devolvemos el usuario asociado a dicho token.

### Testeo en ThunderClient

Necesitamos varias cosas previamente definidas: la ruta/controller para crear nuevos usuarios, la ruta/ctrl para realizar el login, y la ruta/ctrl de verificacion de token(esto mismo)

Realizamos un POST a create user:

```
http://localhost:3000/user
```

Y por body le pasamos las propiedades esperadas por el mismo, en este caso:

```
{
  "email": "admin@test2.com",
  "password": "Password_123",
  "type": "Parents",
  "nombre": "papito",
  "apellidoPaterno": "padreTest",
  "apellidoMaterno": "padreTest",
  "complete": false,
  "validate": true,
  "state": true
}
```

Si todo salió OK obtendremos de respuesta algo cómo:

```
{
  "id": "0f3bb75d-6ea1-434d-ae3e-3058215c0402",
  "subtype": 1,⚠️recordar que subtipo 1 es el creado 'manual' y el 2 es creado vía Auth0
  "email": "admin@test2.com",
  "password": "$2b$10$jMLlloUSOuzpa3P6ABwjV.vwnqXSPUpjr4xb3F2l6WjM26VBfmxia", ⚠️Esta es la pass HASHEADA
  "type": "Parents",
  ...}
```

Una vez creado el usuario(habrá que repetir el proceso si realizamos cambios en los archivos y tenemos drop automático de nuestra BD) procedemos a hacer el login del mismo

Petición POST a:

```
http://localhost:3000/login
```

Y por body usamos las credenciales dadas al crear el usuario:

```
{
  "email": "admin@test2.com",
  "password": "Password_123"
}
```

La respuesta esperada debe ser un token generado aleatoriamente:

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZjNiYjc1ZC02ZWExLTQzNGQtYWUzZS0zMDU4MjE1YzA0MDIiLCJ0eXBlIjoiUGFyZW50cyIsIm5vbWJyZSI6InBhcGl0byIsImlhdCI6MTcxMjk0NDgzNCwiZXhwIjoxNzEyOTg4MDM0fQ.VvbiT2yWYeXJbsxrg5aNIL4tbvjiweO1sAyQJCWqEeY"
}
```

Una vez obtenido nuestro token, realizamos una petición tipo GET, colocando en "Headers" un campo Authorization y en value el token que obtuvimos previamente(solo el token) y en la ruta

```
http://localhost:3000/authenticate
```

Si todo salió OK deberemos obtener como respuesta el usuario vinculado a dicho token:

```
{
  "user": {
    "userId": "d7d8d576-04db-4d18-af9f-7e7e405a955c",
    "type": "Parents",
    "nombre": "papito",
    "iat": 1712946422,
    "exp": 1712989622
  }
}
```

#### Conexión con el front:

Redux/Actions/ActionAuth.js

El caminito sería:

En el componente Login.jsx inicia la conexión, se introduce el user y pass y se despacha la acción al reducer para que se genere un nuevo token ya que por defecto en mi reducer sera **_null_**.

El reducer utiliza la acción LOGIN*USER_SUCCESS para ello, en el que dicha acción en su fn \*\*\_loginUser*\*\* es la que se encarga de hacer la petición al back a la ruta respectiva(http://localhost:3000/login) y de ello toma el token brindado por el servidor.

Una vez obtenido el token entonces utiliza la función **_loginUserSuccess_** a la cual se le pasa ese token como parámetro y mediante el metodo jwtDecode como bien indica, se decodifica ese token para poder ser usado en el cliente(navegador) y mantener la persistencia de la sesión

Retornamos LOGIN_USER_SUCCESS con su carga útil el token.

Ahora vovliendo al reducer nuestro case LOGIN_USER_SUCCESS ya tendra en su paylaod el token necesario por lo que el state del token dejará de ser "null" y cambiará al payload correspondiente.

Volviendo a nuestro Login, "authToken" ahora tiene uno por lo que se lo pasaremos a nuestro useEffect y este ahora solo deberá verificar que tipo de usuario es el que esta iniciando sesión mediante su propiedad type para saber a que ventana redirigirá según sea el caso.

El logueo es lo de siempre, necesito un estado para almacenar el email y password que será ingresado, que lo inicializamos vacío(loginData) y otro estado para manejar los errores también iniciado vacío(error).

Una fn **_validateLogin_** para verificar lo recibido en el campo email y password a la cual le daremos lo que capturó **_loginData_** para que constate la funcion dedidcada a tal fin, en caso de haber errores u omisiones cambiara el state de errors con la información correspondiente.

Por supuesto la fn para validar email y password **_sólo_** se encargará de verificar que estos cumplan con el formato regex esperado, o que no estén vacíos. Si el pass es válido o existente lo verifica otra fn.

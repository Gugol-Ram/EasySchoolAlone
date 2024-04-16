# Auth0: Registro o Logueo UTILIZANDO AUTH0

Será nuestro gestor encargado de iniciar sesión con una cuenta externa como por ejemplo Gmail, Facebook, Twitter o cualquier otro proveedor de identidad. Es decir no será necesario 'crear' un usuario de la forma tradicional sino que se usarán dichas opciones.

También haremos uso de JWT para hacer el encriptado de las cuentas generadas por este medio, ya que la base de datos espera el 'hasheo'(encriptado) de las contraseñas.

## QUE ES EL HASH?

básicamente es un encriptado alfanumerico unico de la cadena de texto ingresada como contraseña(en este caso), variar una sola letra o numero da como resultado un hash **_completamente distinto_**, se lo podría considerar cómo un ID. Lo que se realiza es una comparación de hashes, el ingresado(es decir la contraseña del usuario convertida a hash) y el contenido por la BD

### Auth0 Controller

Aqui tendremos nuestra lógica para loguearnos(si ya nos registramos previamente con Auth0) o para 'desencadenar' la creación de un nuevo usuario mediante Auth0 y no mediante el formulario de registro.

Requeriremos variables de entorno, nuestro modelo usuario **_Obtenido_** de nuestra bd, generar un JWT y una contraseña aleatoria(temporal) etc.

Además, hacemos uso de nodemailer para que en caso de registrarnos usando Auth0(es decir una cuenta de una red social por ej) tambien se nos envie el mensaje de bienvenida.

```
require("dotenv").config();
const { User } = require('../config/db');
const jwt = require('jsonwebtoken'); //instalar
const crypto = require('crypto'); // No se instala ya viene por defecto es nativo de Node.js
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt")//libreria para el hasheo seguro de la contraseña.
const saltRounds = 10; // Numero de rondas del hashing, a + numero + segura, pero también + lento su procesamiento.
const userAuth0Controller = {};
const { sendConfirmationEmail } = require("../notif/nodemail/RegistroNotifUser")
```

Notar que inicializamos un objeto vacío que llenaremos automaticamente según el resultado obtenido del controlador

```
const userAuth0Controller = {};
```

Luego nuestra función analizará mediante el método **_loginOrSignup_** si es un usuario existente o si se debe crear, tomando los datos por el body de la solicitud buscará la coincidencia en el email.

```
userAuth0Controller.loginOrSignup = async (req, res) => {
     try {
          const { email, given_name, family_name } = req.body
          let user = await User.findOne({ where: { email: email } });
          ...}}
```

Si no existe el usuario entonces le asignamos una password temporal utilizando crypto que se encarga de generar aleatoriamente bytes para luego utilziar toString('hex') que los convierte en una cadena hexadecimal legible

Además, luego de que se genera la password, le aplicamos el hasheo.

```
...
if (!user) {
               const temporaryPassword = crypto.randomBytes(10).toString('hex');
               const hasheadPassword = await bcrypt.hash(temporaryPassword, saltRounds)
               console.log("esta seria la constraseña aleatoria creada", hasheadPassword)
               ...}
```

Una vez obtenida la password entonces estamos en condiciones de crear nuestro usuario dándole los parametros esperados

```
...
  user = await User.create({
                    email,
                    password: hasheadPassword,
                    nombre: given_name,
                    apellidoPaterno: family_name,
                    apellidoMaterno: family_name,
                    type: "Parents",
                    subtype: 2, // 1 cuando es creado manual y 2 cuando vienen por auth0 para pedirle luego que cambie su contraseña
               });
               sendConfirmationEmail(email)
               const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
                    expiresIn: '3h'
               });
               ...
```

El **_email_** será el mismo de la cuenta, a su vez de dicha cuenta necesitamos su **_Nombre_** y **_Apellido_**, en nuestra app tenemos desglosado por separado los apellidos(al vicio)
❗❗❗Probar si funciona utilizando comillas en el materno, ya que sino se repetiría dos veces el apellido, creo.

El **_password_** es el que se acaba de generar, el **_type_** será por defecto el usuario tipo padre(propiedad 'exclusiva y requerida' de esta aplicación)
y **_subtype_** será 2, para pedir mas tarde que el usuario cambie su contraseña ya que la temporal caducará.

Envíamos la notificación de NodeMailer y establecemos el token con el id del usuario(para relacionarlo) el secreto para firmar(validar) el token y para mantener la persistencia de la sesión y una duracion de su validez. Este token se utiliza para validar las solicitudes del usuario en la pagina.

⚠️⚠️IMPORTANTE⚠️⚠️ le agregamos un parámetro extra que será de vital importancia al llegar la petición desde el frontend.

```
const isNewUser = true
```

Por último, en caso de verificar que el usuario ya exista, le asignamos un token para el inicio y persistencia de la sesión.

```
{...
if (user.subtype === 2) {
               // Generar un token JWT para el usuario que ha iniciado sesión
               const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
                    expiresIn: '3h'
               });
               console.log("Tocken enviado al front usuario registrado ya en bd", token)
               return res.status(200).json({ message: 'Inicio de sesión exitoso usando Auth0', token, user });
          }
     } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error controllador auth0' });
     }
```

#### Conexión con el front en:

Components/Forms/LoginForm

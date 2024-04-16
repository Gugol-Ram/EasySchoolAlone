# Auth: Registro o Logueo 'TRADICIONAL'(Mediante el formulario)

(Mejor si cambio el nombre a uno mas representativo o entendible...)

Parecido al controlador de Auth0, importamos User de nuestra BD, dotenv para trabajar con nuestras variables de entorno, tambien bcrypt para el hasheo de la contraseña para poder compararla(ya que en nuestra BD se encuentra almacenada de dicha manera, nuestro controller de createUSEr se encarga de ello) y jwt para asignar el token de inicio de seión para que el usuario pueda interactuar en la pagina.

```
const { User } = require("../config/db");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
```

Toammos el email y password recibido desde el front por el body, y buscamos si hay match de dicho email en nuestra BD. En caso de no haber respondemos con el mensaje de error que creamos conveniente.

Ádemas de ello verificamos que sea un usuario activo, ya que puede existir el email pero ser un usuario dado de baja. También respondemos con un mensaje adecuado.

```
const loginUser = async (req, res) => {
     const { email, password } = req.body;
     console.log(req)
     try {
          const user = await User.findOne({ where: { email } });
          if (!user) {
               return res.status(401).json({ error: 'Invalid credentials' });
          };
          if (!user.state) {
               return res.status(401).json({ error: 'User is not active' });
          }
          ...}
          ...}
```

Si el usuario existe y esta activo, entonces verificamos la contraseña, enviando el hash. En caso de no coincidir manejamos el error adecuadamente.

```
const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
               return res.status(401).json({ error: 'Invalid credentials' });
          };
```

Si todo salío OK otorgamos el token, útil para la persistencia de la sesión y que el usuario pueda interactuar en la página.

```
const token = jwt.sign(
               { userId: user.id, type: user.type, nombre: user.nombre },
               JWT_SECRET,
               { expiresIn: '12h' },
          );
          return res.status(200).json({ token });
```

Manejamos el posible caso de error general del servidor

```{...
{...
} catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
     };
};

module.exports = { loginUser };
```

# Código final

```
const { User } = require("../config/db");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
     const { email, password } = req.body;
     console.log(req)
     try {
          const user = await User.findOne({ where: { email } });
          if (!user) {
               return res.status(401).json({ error: 'Invalid credentials' });
          };
          if (!user.state) {
               return res.status(401).json({ error: 'User is not active' });
          };
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
               return res.status(401).json({ error: 'Invalid credentials' });
          };
          const token = jwt.sign(
               { userId: user.id, type: user.type, nombre: user.nombre },
               JWT_SECRET,
               { expiresIn: '12h' },
          );
          return res.status(200).json({ token });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
     };
};

module.exports = { loginUser };
```

#### Conexión con el front en:

Redux/Actions/Actions-Login.js

Components/Forms/LoginForm(⚠️Verificar si aca tambien)

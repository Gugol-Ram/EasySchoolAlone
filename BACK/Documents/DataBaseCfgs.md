# Inicialización de nuestra Base de Datos

Requeriremos de varias dependencias para comenzar a trabajar:

Dotenv para poder trabajar con nuestras variables de entorno.

Al ser una BD SQL requeriremos sequelize para la misma

fs(file search): para poder hacer búsqueda de los archivos necesarios para **_cargar_** los modelos en una matriz para tal fin(aunque al final usaremos el método tradicional explícito)

Junto a fs necesitamos a **_path_** para especificar rutas no dinámicas(hardcoded)

Las variables de entorno necesarias para formalizar la estructura esperada al crear una nueva BD.(USER, PASS, HOST y NAME para la BD)

y comenzamos creando la BD en base a todo lo anterior quedando de la siguiente forma:

```
require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const sequelize = new Sequelize(
     `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
     {
          logging: false,
          native: false,
     }
);
```

También se deshabilita el registro de consultas SQL **_(logging: false)_** y se establece el modo nativo a **_false_**

Se lee el directorio **_models_** para encontrar archivos de definición de modelos de Sequelize. Cada archivo de modelo se importa y se agrega a la matriz **_modelDefiners_**.

```
const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "../models"))
     .filter(
          (file) =>
               file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
     )
     .forEach((file) => {
          modelDefiners.push(require(path.join(__dirname, "../models", file)));
     });

modelDefiners.forEach((model) => model(sequelize));
```

## Algunas aclaraciones importantes de la carga de modelos

"\_\_dirname" representa el directorio actual del archivo en ejecución por lo que (../models) está situado un nivel por encima del **_directorio actual_**.

El resultado de **_readdirSync_** es un arreglo de nombres de archivos en el directorio. Este método filter se utiliza para filtrar los archivos que cumplan con ciertos criterios:

**_file.indexOf(".") !== 0_** : Se asegura de que el archivo no comience con un punto, lo que indica que no es un archivo oculto.

**_file !== basename_** : Excluye el archivo actual (config.js) del procesamiento.

**_file.slice(-3) === ".js"_** : Verifica que la extensión del archivo sea .js.

**_.forEach(...)_** : Para cada archivo que pasa el filtro, se carga dinámicamente utilizando require y se agrega a la matriz **_modelDefiners_**. Esto significa que cada archivo de modelo encontrado se importa y se añade a esta matriz.

Debido a que los archivos se importan dinámicamente y se agregan a la matriz **_modelDefiners_**, no se conocen por sus nombres originales. Por eso, más adelante, se necesita un mapeo explícito de estos modelos a nombres específicos para hacer referencia a ellos más fácilmente en el código.

Por ejemplo, si tienes un archivo de modelo llamado **_user.js_**, después de que se cargue y se agregue a **_modelDefiners_**, podrías tener acceso a él a través de **_sequelize.models.User_** (ya que Sequelize agrupa todos los modelos bajo models) Por lo que luego en el codigo hacemos una invocación explicita de los modelos y su relación.

**_Ventajas_** de usar **_modelDefiners_**:

**_Flexibilidad:_** Al cargar dinámicamente los archivos de modelo, tu aplicación puede ser más flexible en términos de agregar nuevos modelos sin necesidad de modificar manualmente el archivo de configuración cada vez que se agrega un nuevo modelo.

**_Automatización:_** Si tienes una gran cantidad de modelos y quieres evitar tener que importar manualmente cada uno de ellos, cargarlos dinámicamente puede ser una solución más automatizada y menos propensa a errores.

**_Desventajas_** de usar **_modelDefiners:_**

**_Menos legibilidad:_** Al no tener una asignación explícita de modelos con nombres descriptivos, puede resultar más difícil entender qué modelos están disponibles en la aplicación, especialmente para aquellos que no están familiarizados con el código.

**_Menor control:_** Dependiendo de la complejidad de tu aplicación y tus preferencias personales, puede ser preferible tener un mayor control sobre qué modelos se están utilizando y cómo se están importando.

##### Continuando...

Y además iniciamos los nombres de los modelos en mayusculas para una mejor nomeclatura en nuestra db

```
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
     entry[0][0].toUpperCase() + entry[0].slice(1),
     entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);
```

## Relaciones entre modelos

Establecemos la relación que debe haber entre cada modelo para la construcción de la db.

```
const { User, Parents, Estudiante, Grade, Valoracion } = sequelize.models;

User.belongsToMany(Parents, { through: "userParent" });
Parents.belongsToMany(User, { through: "userParent" });

Parents.belongsToMany(Estudiante, { through: "parentEstudiante" });
Estudiante.belongsToMany(Parents, { through: "parentEstudiante" });

Parents.belongsToMany(Valoracion, { through: "valoracionPadre" });
Valoracion.belongsToMany(Parents, { through: "valoracionPadre" });

Estudiante.belongsToMany(Grade, {
     through: "estudianteGrado",
});
Grade.belongsToMany(Estudiante, { through: "estudianteGrado" });
```

Y por último los exportamos.

```
module.exports = {
     ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
     conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
```

# Código final

```
require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
const sequelize = new Sequelize(
     `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
     {
          logging: false,
          native: false,
     }
);

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "../models"))
     .filter(
          (file) =>
               file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
     )
     .forEach((file) => {
          modelDefiners.push(require(path.join(__dirname, "../models", file)));
     });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
     entry[0][0].toUpperCase() + entry[0].slice(1),
     entry[1],
]);

sequelize.models = Object.fromEntries(capsEntries);

const { User, Parents, Estudiante, Grade, Valoracion } = sequelize.models;

User.belongsToMany(Parents, { through: "userParent" });
Parents.belongsToMany(User, { through: "userParent" });

Parents.belongsToMany(Estudiante, { through: "parentEstudiante" });
Estudiante.belongsToMany(Parents, { through: "parentEstudiante" });

Parents.belongsToMany(Valoracion, { through: "valoracionPadre" });
Valoracion.belongsToMany(Parents, { through: "valoracionPadre" });

Estudiante.belongsToMany(Grade, {
     through: "estudianteGrado",
});
Grade.belongsToMany(Estudiante, { through: "estudianteGrado" });

module.exports = {
     ...sequelize.models,
     conn: sequelize,
};
```

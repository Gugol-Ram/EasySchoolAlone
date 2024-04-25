# CARGA AUTOMÁTICA DE DATOS AL INICIALIZAR EL SERVIDOR:

Requeriremos de algunas dependencias y de nuestra db:

**_fs(file search):_** Para poder hacer búsqueda de los archivos necesarios para **_llenar_** la BD con información existente(en este caso ficticia)

Junto a fs necesitamos a **_path_** para especificar rutas no dinámicas(hardcoded)

Y por último a nuestra db ya que allí se escribirán los datos.

```
const fs = require("fs");
const path = require("path");
const db = require("../config/db");
```

Leemos los archivos con la información pertinente, estos serán archivos de tipo **_JSON_**, y deberán tener la estructura esperada por la BD, es decir lo definido en cada modelo respectivo, sobretodo si alguna propiedad allí definida es **_allowNull false_** sino romperá!

Para esta data podemos crear un archivo `js` para cada **_modelo_** con la información necesaria para que al ejecutarlo genere un archivo `JSON` con información aleatoria. En algunos casos puede requerir alguna intervención manual en el `JSON` generado.

Esto es útil cuando nuestro proyecto es muy particular y no se puede consumir o no hay una API que tenga los requerimientos necesarios.

```
const loadDataToDatabase = async () => {
  try {
    // Leer archivos JSON
    const userData = fs.readFileSync(path.join(__dirname, "usersData.json"));
    const parentsData = fs.readFileSync(
      path.join(__dirname, "parentsData.json"),
      "utf8"
    );
    const studentsData = fs.readFileSync(
      path.join(__dirname, "studentsData.json"),
      "utf8"
    );

    const valoracionesData = fs.readFileSync(
      path.join(__dirname, "valoracionesData.json"),
      "utf8"
    );
    const gradeData = fs.readFileSync(
      path.join(__dirname, "gradeData.json"),
      "utf8"
    );
...
  }...}
```

Definimos fn con los nombres de nuestros modelos y los referenciamos a los modelos respectivos en nuestra BD:

```
const User = db.User;
    const Parents = db.Parents;
    const Estudiante = db.Estudiante;
    const Valoracion = db.Valoracion;
    const Grade = db.Grade;
```

Una vez leídos los datos contenidos en archivos JSON utilizando fs.readFileSync los **_parseamos_** a objetos JavaScript utilizando JSON.parse. Cada archivo JSON contiene información correspondiente a un tipo de modelo de la base de datos (usuarios, padres, estudiantes, etc.).

```
    const users = JSON.parse(userData);
    const parents = JSON.parse(parentsData);
    const students = JSON.parse(studentsData);
    const valoraciones = JSON.parse(valoracionesData);
    const grades = JSON.parse(gradeData);
```

Luego queda cargar dicha información a neustra BD, podría ser mediante algun metodo como **_create_** o **_bulkCreate_**:

`await User.bulkCreate(users);`

Pero en este caso como los datos estan interrelacionados entre sí haremos un recorrido individual utilizando un bucle for para ello y siguiendo un órden lógico para que no haya errores. Finalizamos exportando dicha fn ya que será utilizada en nuestro index al inicializar el servidor:

```
{...
{...
 for (const userData of users) {
      try {
        const [user, created] = await User.findOrCreate({
          where: { id: userData.id },
          defaults: userData,
        });

        const parentRelated = parents.filter(
          (parent) => parent.userId === userData.id
        );

        for (const parentData of parentRelated) {
          try {
            const [parent, created] = await Parents.findOrCreate({
              where: { id: parentData.id },
              defaults: parentData,
            });
            await user.addParents(parent);

            // Encontrar estudiantes relacionados con este padre
            const studentsRelatedToParent = students.filter(
              (student) => student.parentId === parent.id
            );

            for (const studentData of studentsRelatedToParent) {
              try {
                const [student, studentCreated] = await Estudiante.findOrCreate(
                  {
                    where: { id: studentData.id },
                    defaults: studentData,
                  }
                );
                await parent.addEstudiante(student);

                const gradesRelatedToStudent = grades.filter(
                  (grade) => grade.studentId === student.id
                );

                for (const gradeData of gradesRelatedToStudent) {
                  try {
                    const [grade, gradeCreated] = await Grade.findOrCreate({
                      where: { id: gradeData.id },
                      defaults: gradeData,
                    });
                    await student.addGrade(grade);
                  } catch (error) {
                    console.error(
                      "Error creating or finding grade:",
                      error.message
                    );
                  }
                }
              } catch (error) {
                return { error: error.message };
              }
            }
            const valoracionesRelatedToParent = valoraciones.filter(
              (value) => value.parentId === parent.id
            );

            for (const valoracionData of valoracionesRelatedToParent) {
              try {
                const [valoracion, valoracionCreated] =
                  await Valoracion.findOrCreate({
                    where: { id: valoracionData.id },
                    defaults: valoracionData,
                  });
                await parent.addValoracion(valoracion);
              } catch (error) {
                return { error: error.message };
              }
            }
          } catch (error) {
            return { error: error.message };
          }
        }
      } catch (error) {
        return { error: error.message };
      }
    }
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  loadDataToDatabase,
};

```

## Código final **_dataLoader.js_**:

```
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const loadDataToDatabase = async () => {
  try {
    // Leer archivos JSON
    const userData = fs.readFileSync(path.join(__dirname, "usersData.json"));
    const parentsData = fs.readFileSync(
      path.join(__dirname, "parentsData.json"),
      "utf8"
    );
    const studentsData = fs.readFileSync(
      path.join(__dirname, "studentsData.json"),
      "utf8"
    );

    const valoracionesData = fs.readFileSync(
      path.join(__dirname, "valoracionesData.json"),
      "utf8"
    );
    const gradeData = fs.readFileSync(
      path.join(__dirname, "gradeData.json"),
      "utf8"
    );
    const User = db.User;
    const Parents = db.Parents;
    const Estudiante = db.Estudiante;
    const Valoracion = db.Valoracion;
    const Grade = db.Grade;

    const users = JSON.parse(userData);
    const parents = JSON.parse(parentsData);
    const students = JSON.parse(studentsData);
    const valoraciones = JSON.parse(valoracionesData);
    const grades = JSON.parse(gradeData);

    for (const userData of users) {
      try {
        const [user, created] = await User.findOrCreate({
          where: { id: userData.id },
          defaults: userData,
        });

        const parentRelated = parents.filter(
          (parent) => parent.userId === userData.id
        );

        for (const parentData of parentRelated) {
          try {
            const [parent, created] = await Parents.findOrCreate({
              where: { id: parentData.id },
              defaults: parentData,
            });
            await user.addParents(parent);

            // Encontrar estudiantes relacionados con este padre
            const studentsRelatedToParent = students.filter(
              (student) => student.parentId === parent.id
            );

            for (const studentData of studentsRelatedToParent) {
              try {
                const [student, studentCreated] = await Estudiante.findOrCreate(
                  {
                    where: { id: studentData.id },
                    defaults: studentData,
                  }
                );
                await parent.addEstudiante(student);

                const gradesRelatedToStudent = grades.filter(
                  (grade) => grade.studentId === student.id
                );

                for (const gradeData of gradesRelatedToStudent) {
                  try {
                    const [grade, gradeCreated] = await Grade.findOrCreate({
                      where: { id: gradeData.id },
                      defaults: gradeData,
                    });
                    await student.addGrade(grade);
                  } catch (error) {
                    console.error(
                      "Error creating or finding grade:",
                      error.message
                    );
                  }
                }
              } catch (error) {
                return { error: error.message };
              }
            }
            const valoracionesRelatedToParent = valoraciones.filter(
              (value) => value.parentId === parent.id
            );

            for (const valoracionData of valoracionesRelatedToParent) {
              try {
                const [valoracion, valoracionCreated] =
                  await Valoracion.findOrCreate({
                    where: { id: valoracionData.id },
                    defaults: valoracionData,
                  });
                await parent.addValoracion(valoracion);
              } catch (error) {
                return { error: error.message };
              }
            }
          } catch (error) {
            return { error: error.message };
          }
        }
      } catch (error) {
        return { error: error.message };
      }
    }
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  loadDataToDatabase,
};
```

# EJECUTANDO LA CARGA DE DATOS DESDE **_BACK/index.js_**:

Nuestro index es el archivo donde se inicializa el servidor backend(al hacer npm start se ejecuta a su vez el script 'server', y éste ejecuta 'nodemon index.js').

Para ello requeriremos variables de entorno(en este caso sólo para asignar el puerto específico), neustro archivo server, nuestra conexión a la BD y por ultimo el archivo encargado de "cargar" la BD con información.

```
require("dotenv").config();
const server = require("./src/server");
const { conn } = require("./src/config/db.js");
const { loadDataToDatabase } = require("./src/config/dataLoader.js");
const { PORT } = process.env;
```

Con una operación **_asíncrona_**, esperamos a que se **_sincronice_** la BD mediante el método `force`.

Si este es `false` entonces si se verifica que la tabla existe esta no será eliminada sino que solo se actualizaran los datos nuevos ante cada cambio del servidor.

En cambio si es `true` significará que cada vez que se reinicie el servidor la BD será eliminada y se creará nuevamente por lo que no habra persistencia en los datos al hacer cualquier modificación sobre el back. para realizar deploy quitar el true.

Luego de realizada la sincronización, esperamos a que se ejecute el archivo encargado de cargar la información para llenar la BD e imprimimos en consola el mensaje de espera.
Manejamos errores adecuadamente imprimiendo en consola el posible error.

```
(async () => {
  try {
    await conn.sync({ force: true });
    console.log("Database schema synchronized.");

    await loadDataToDatabase();
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}.`);
    });
  } catch (error) {
    console.error(error);
  }
})();
```

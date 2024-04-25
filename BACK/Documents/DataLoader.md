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

# Código final:

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

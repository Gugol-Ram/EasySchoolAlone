# Utilizando JOI

Es una libreria que sirve para hacer una validación de los datos recibidos en el servidor.

La estructura es sencilla, podemos validar mediante formatos `regex` los datos esperados en determinados campos como nombres, formato de correo electrónico válido, cantidad de caracteres, validez de booleanos etc.

En caso de error manejamos el mensaje adecuadamente sino finalizamos con parámetro `next` para que continúe la lectura.

## DETALLE EN NEW PARENT VALIDATION.

En este caso el controlador además de verificar los datos, maneja de mejor manera la posibilidad de que existan varios errores en simultanéo, ya que los demás middlewares al encontrar el primer error corta la ejecución y devuelve el error encontrado, pero si hay mas campos erroneos se vuelve tedioso que se informe de uno en uno. En cambio parentValidation toma una lectura de todos los campos erroneos y devuelve el error informándolos en conjunto ya sean campos inválidos y/o faltantes.

```
const Joi = require("joi");
const cloudinaryUrl = Joi.string().regex(
  /^https:\/\/res.cloudinary.com\/your_cloud_name\/image\/upload\/.*$/
);

const newParentValidation = (req, res, next) => {
  const schema = Joi.object({
    idDoc: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .required()
      .label("ID Document"),
    fotoDocumento: Joi.string()
      .regex(/^(ftp|http|https):\/\/[^ "]+$/)
      .required()
      .error(new Error("El campo fotoDocumento debe ser una URL válida")),
    //
    // fotoDocumento: Joi.string().uri({ scheme: ['http', 'https'] }).required().concat(cloudinaryUrl),
    name: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    educationLevel: Joi.string().required().label("Education Level"),
    profession: Joi.string().required().label("Profession"),
    address: Joi.string().required().label("Address"),
    jobAddress: Joi.string().required().label("Job Address"),
    telephone: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .required()
      .label("Home Telephone"),
    jobTelephone: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .required()
      .label("Work Telephone"),
    contactCellphone: Joi.string()
      .pattern(/^[0-9]{7,15}$/)
      .required()
      .label("Contact Cell Phone"),
    email: Joi.string().required().label("Email").email(),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Para recopilar todos los errores, no solo el primero
    stripUnknown: true, // Elimina claves adicionales no definidas en el esquema
  });

  if (error && error.details && Array.isArray(error.details)) {
    const missingFields = error.details.map((detail) => detail.context.label);
    return res.status(400).json({
      error: `Missing or Invalid field(s): ${missingFields.join(", ")}`,
    });
  }

  req.validatedData = value; // Almacena los datos validados en el objeto de solicitud para su uso posterior
  next();
};

module.exports = {
  newParentValidation,
};
```

### Auth0Middleware:

Pareciera estar sin uso, todavía no encuentro donde se lo importa o utiliza.

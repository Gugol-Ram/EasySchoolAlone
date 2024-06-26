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

  // if (error) {
  //   const missingFields = error.details.map((detail) => detail.context.label);
  //   return res.status(400).json({
  //     error: `Missing or Invalid field(s): ${missingFields.join(", ")}`,
  //   });
  // }
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

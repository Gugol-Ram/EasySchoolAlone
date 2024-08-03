const { Valoracion, Parents } = require("../config/db");
const { conn } = require("../config/db");

// Create Valoracion
const createValoracion = async (req, res) => {
  try {
    const { parentId } = req.body;
    const parent = parentId ? await Parents.findByPk(parentId) : null;

    if (!parentId && !parent) {
      return res.status(404).json({
        error: "Parent not found or is missing, can't create feedback",
      });
    }
    const newValoracion = await Valoracion.create(req.body);

    if (parentId && parent) {
      await newValoracion.addParent(parent);
    }
    return res.status(201).json({ valoracion: newValoracion });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    }
    return res.status(500).json({
      error: "Cannot create. Missing or incorrect fields. ISR",
    });
  }
};

// todas las Valoraciones
const getAllValoraciones = async (_, res) => {
  try {
    const valoraciones = await Valoracion.findAll({
      include: {
        model: Parents,
        through: "valroacionPadre",
      },
    });
    return res.status(200).json(valoraciones);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message` Cannot get Feedbacks. ISE.` });
  }
};

//Valoracion by ID
const getValoracionById = async (req, res) => {
  const { id } = req.params;
  try {
    const valoracion = await Valoracion.findByPk(id);
    if (!valoracion) {
      return res
        .status(404)
        .json({ error: "Cannot Get by ID, not Found/exists. ISE" });
    }
    return res.status(200).json(valoracion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message`ISE getting ID` });
  }
};

// Update Valoracion by ID
const updateValoracionById = async (req, res) => {
  const { id } = req.params;
  try {
    const valoracion = await Valoracion.findByPk(id);
    if (!valoracion) {
      return res
        .status(404)
        .json({ error: "Cannot Update, FeedBack not Found/exists. ISE" });
    }
    await Valoracion.update(req.body, { where: { id } });
    const updatedValoracion = await Valoracion.findByPk(id);
    return res.status(200).json(updatedValoracion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot update feedback. ISE" });
  }
};

// Delete Valoracion by ID
const deleteValoracionById = async (req, res) => {
  const { id } = req.params;
  try {
    const valoracion = await Valoracion.findByPk(id);
    if (!valoracion) {
      return res
        .status(404)
        .json({ error: "Cannot delete. FeedBack not Found/exists" });
    }
    await Valoracion.destroy({ where: { id } });
    return res.status(200).json({ message: "FeedBack deleted Succesfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot delete. ISE" });
  }
};

const hasParentRated = async (req, res) => {
  const { parentId } = req.params;

  try {
    const result = await conn.models.valoracionPadre.findOne({
      where: { ParentId: parentId },
    });

    if (result) {
      res.status(200).json({ hasRated: true });
    } else {
      res.status(200).json({ hasRated: false });
    }
  } catch (error) {
    console.error("Cannot check if parent has rated:", error);
    res.status(500).json({
      error: `${error.message} Cannot check if parent has rated. ISE.`,
    });
  }
};

module.exports = {
  createValoracion,
  getAllValoraciones,
  getValoracionById,
  updateValoracionById,
  deleteValoracionById,
  hasParentRated,
};

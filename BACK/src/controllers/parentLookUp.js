const { Parents, User, conn } = require("../config/db");

const getParentIdsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const userParents = await User.findByPk(userId, {
      include: {
        model: Parents,
        attributes: ["id"],
        through: { attributes: [] },
      },
    });
    if (!userParents) {
      return res.status(404).json({ error: "User not found" });
    }
    // Extract the Parents ids from the result
    const parentIds = userParents.Parents.map((parent) => parent.id);
    // Look up the Parents table with the extracted Parents ids
    const parentDetails = await Parents.findAll({
      where: { id: parentIds },
      attributes: ["id"],
    });
    res.status(200).json({ parentDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserIdByParentId = async (req, res) => {
  const { id } = req.params;
  try {
    const userParentRecord = await conn.models.userParent.findOne({
      where: { ParentId: id }, // Aquí usamos el nombre real de la columna en tu tabla intermedia
      attributes: ["UserId"], // Aquí usamos el nombre real de la columna en tu tabla intermedia
    });

    if (!userParentRecord) {
      return res.status(404).json({ error: "Parent not found" });
    }

    const userId = userParentRecord.UserId;

    res.status(200).json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getParentIdsByUserId,
  getUserIdByParentId,
};

// controllers/authController.js
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

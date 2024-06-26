const { User } = require("../config/db");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.state) {
      return res.status(401).json({ error: "User is not active" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials: pass" });
    }
    const token = jwt.sign(
      { userId: user.id, type: user.type, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { loginUser };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const { validate: isUuid } = require("uuid");
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOneByEmail(email);

    if (user) {
      return res.status(422).json({ errors: ["Por favor, use outro e-mail."] });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: passwordHash });

    if (!newUser) {
      return res.status(422).json({
        errors: ["Ocorreu um erro. Por favor, tente novamente mais tarde."],
      });
    }

    res.status(201).json({ _id: newUser.id, token: generateToken(newUser.id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro interno do servidor."] });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("BODY RECEBIDO NO BACKEND:", req.body, email, password);

  try {
    const user = await User.findOneByEmail(email);
    console.log("BODY RECEBIDO NO BACKEND:", req.body, email, password, user);
    console.log(user);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(422).json({ errors: ["Senha inválida."] });
    }

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro interno do servidor."] });
  }
};

const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

const update = async (req, res) => {
  const { name, password, bio } = req.body;
  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  try {
    const userToUpdate = await User.findById(reqUser.id);
    if (!userToUpdate) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.update(reqUser.id, {
      name,
      password: passwordHash,
      profileImage,
      bio,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro interno do servidor."] });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ errors: ["Formato de ID inválido."] });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro interno do servidor."] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};

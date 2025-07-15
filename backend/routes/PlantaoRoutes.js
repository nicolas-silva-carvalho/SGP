const express = require("express");
const router = express.Router();

// Importa as funções do Controller
const { create, getAllPlantoes } = require("../controllers/PlantaoController");

// Importa middlewares que você pode querer usar
const authGuard = require("../middlewares/authGuard"); // Ex: Garante que o usuário está logado
const validate = require("../middlewares/handleValidation"); // Seu middleware de validação

// Aqui você pode criar validações específicas para o plantão, assim como fez para o usuário
// const { plantaoCreateValidation } = require("../middlewares/plantaoValidations");

// Define a rota POST para criar um plantão
// Você pode adicionar o authGuard para proteger a rota
router.post("/", authGuard, create);

// Define a rota GET para listar todos os plantões
router.get("/", authGuard, getAllPlantoes);

module.exports = router;

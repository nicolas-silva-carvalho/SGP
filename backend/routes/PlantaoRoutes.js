const express = require("express");
const router = express.Router();

const {
  create,
  getAllPlantoes,
  update,
} = require("../controllers/PlantaoController");

const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

router.post("/", authGuard, create);
router.put("/:id", authGuard, update);
router.get("/", getAllPlantoes);

module.exports = router;

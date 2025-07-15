const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));

router.use("/api/plantao", require("./PlantaoRoutes"));

router.get("/", (req, res) => {
  res.send("API WORKING!");
});

module.exports = router;

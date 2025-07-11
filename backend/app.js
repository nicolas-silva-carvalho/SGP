const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const { connectToDB } = require("./config/db.js");
connectToDB();

const router = require("./routes/Router.js");

app.use(router);

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});

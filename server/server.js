const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(cors());

app.listen(PORT, () =>
  console.log(`---> Server started on ${PORT} port <---`)
);

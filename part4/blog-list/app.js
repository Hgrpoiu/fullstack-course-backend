const express = require("express");
const config = require("./utils/config");
require("express-async-errors");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const Blog = require("./models/blog");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const errorHandler = require("./middleware/errorHandler").errorHandler;
const getTokenHandler = require("./middleware/getTokenHandler").getTokenHandler;

console.log(`Connecting to ${config.MONGODB_URI}`);
mongoose
  .connect(config.MONGODB_URI)
  .then((res) => {
    console.log("Connected!!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(getTokenHandler);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testRouter = require("./controllers/reset");
  app.use("/api/reset", testRouter);
}

app.use(errorHandler);

module.exports = app;

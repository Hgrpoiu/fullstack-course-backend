const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  const correctPassword =
    password === null
      ? false
      : await bcrypt.compare(password, user.passwordHash);

  if (!(correctPassword && user)) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  const newTok = { username: user.username, id: user.id };

  const token = jwt.sign(newTok, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;

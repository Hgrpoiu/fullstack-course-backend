const bcrypt = require("bcryptjs");
const userRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const exist = await User.findOne({ username });

  if (exist) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password must be of length >3",
    });
  }

  // THE MAGICAL SALT ROUNDS, OOOOOOO!!!!!~
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const blogs = await Blog.find({ name });
  const newUser = new User({
    username,
    name,
    passwordHash,
    blogs: blogs[0].id,
  });

  response.status(201).json(await newUser.save());
});

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    author: 1,
    title: 1,
    id: 1,
  });

  response.json(users);
});

module.exports = userRouter;

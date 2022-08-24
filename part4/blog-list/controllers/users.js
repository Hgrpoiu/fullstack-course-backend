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

  let blogs = await Blog.find({ name });
  let content;
  if (!blogs[0]) {
    content = null;
  } else {
    content = blogs[0].id;
  }
  const newUser = new User({
    username,
    name,
    passwordHash,
    blogs: content,
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

userRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("blogs", {
    url: 1,
    author: 1,
    title: 1,
    id: 1,
  });

  response.json(user);
});

module.exports = userRouter;

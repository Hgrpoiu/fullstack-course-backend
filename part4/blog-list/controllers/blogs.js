const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const userExtractor = require("../middleware/userExtractor").userExtractor;

const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  response.json(
    await Blog.find({}).populate("user", { username: 1, name: 1, id: 1 })
  );
});

blogRouter.get("/:id", async (request, response) => {
  response.json(
    await Blog.findById(request.params.id).populate("user", {
      username: 1,
      name: 1,
      id: 1,
    })
  );
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  let likes = 0;

  if (body.likes) {
    likes = body.likes;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes,
    user: request.user,
  });

  const savedBlog = await blog.save();
  const asisUser = await User.findById(request.user);

  const updatedUser = {
    id: asisUser.id,
    username: asisUser.username,
    name: asisUser.name,
    passwordHash: asisUser.passwordHash,
    blogs: asisUser.blogs.concat(savedBlog._id),
  };

  await User.findByIdAndUpdate(request.user, updatedUser, {
    new: true,
    runValidators: true,
    context: "query",
  });

  response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const parmId = request.params.id;

  const blog = await Blog.findById(parmId);

  if (request.user !== blog.user.toString()) {
    return response.status(400).json({
      error: "bad token",
    });
  }

  await Blog.findByIdAndDelete(parmId);
  response.status(204).json().end();
});

blogRouter.post("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    comments: blog.comments.concat(request.body.comment),
  };

  const res = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(res)
});

blogRouter.put("/:id", async (request, response) => {
  //This is bad security, but I'm not checking it for right now <3
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  response.json(
    await Blog.findByIdAndUpdate(request.params.id, newBlog, {
      new: true,
      runValidators: true,
      context: "query",
    })
  );
});

module.exports = blogRouter;

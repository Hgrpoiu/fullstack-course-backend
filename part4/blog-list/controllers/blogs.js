const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const userExtractor=require("../middleware/userExtractor").userExtractor

const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  response.json(
    await Blog.find({}).populate("user", { username: 1, name: 1, id: 1 })
  );
});

blogRouter.post("/",userExtractor, async (request, response) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    user: request.user,
  });

  response.status(201).json(await blog.save());
});

blogRouter.delete("/:id",userExtractor, async (request, response) => {
  const parmId = request.params.id;

  const blog = await Blog.findById(parmId)

  if (request.user!== blog.user.toString()) {
    return response.status(400).json({
      error: "bad token",
    });
  }

  await Blog.findByIdAndDelete(parmId);
  response.status(204).json().end();
});

blogRouter.put("/:id", async (request, response) => {
  const newBlog = {
    title: request.params.title,
    author: request.params.url,
    url: request.params.url,
    likes: request.params.likes,
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

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./testHelper");
const Blogs = require("../models/blog");
//   Init Database
beforeEach(async () => {
  await Blogs.deleteMany();
  await Blogs.insertMany(helper.blogs);
});

describe("Blog API test to ensure zero regression", () => {
  test("GET request", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("POST response", async () => {
    const newBlog = {
      title: "BEEEEES",
      author: "BEEMAN",
      url: "boobs.org",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", helper.user.token)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("ID existance", async () => {
    const logs = await api.get("/api/blogs");
    expect(logs.body[0].id).toBeDefined();
  });

  test("No likes means zero", async () => {
    const newBlog = {
      title: "be",
      author: "bem",
      url: "borg.org",
    };
    const sentBlog = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", helper.user.token);
    expect(sentBlog.body.likes).toBe(0);
  });

  test("No data means 400, bad request", async () => {
    const newBlog = {
      author: "beeeeeafm",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", helper.user.token)
      .expect(400);
  });

  test("No token means 401,not auth", async () => {
    const newBlog = {
      title: "BEEEEES",
      author: "BEEMAN",
      url: "boobs.org",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("blog API: Del/Update", () => {
  test("delete", async () => {

    const token=helper.user.token
    const newBlog = {
      title: helper.user.username,
      author: "BEEMAN",
      url: "boobs.org",
      likes: 0,
    };

    const blog = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", token);

    await api
      .delete(`/api/blogs/${blog.body.id}`)
      .set("Authorization", token)
      .expect(204);
  });

  test("update", async () => {
    const newBlog = {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 99,
      __v: 0,
    };
    await api
      .put("/api/blogs/5a422a851b54a676234d17f7")
      .send(newBlog)
      .expect(200);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const helper = require("./testHelper");

beforeEach(async () => {
  const hash = await bcrypt.hash("shhhhh", 10);
  await User.deleteMany({});
  await new User({
    username: "ggggggggg",
    name: "gggggggggggggg",
    passwordHash: hash,
  }).save();
});

describe("basic user functionality", () => {
  test("post case", async () => {
    const user = {
      username: "fried",
      name: "JIMMIEATIE",
      password: "foooooods",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("get Case", async () => {
    api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("user:invalid use cases", () => {
  test("password<3", async () => {
    const user = {
      username: "jongleboy222",
      name: "JIMMIEATIE",
      password: "ji",
    };

    await api.post("/api/users").send(user).expect(400);
  });
  test("username<3", async () => {
    const user = {
      username: "jo",
      name: "JIMMIEATIE",
      password: "jiffffffffff",
    };

    await api.post("/api/users").send(user).expect(400);
  });
  test("Username not unique", async () => {
    const user = {
      username: "ggggggggg",
      name: "JIMMIEATIE",
      password: "jiffffffffff",
    };

    await api.post("/api/users").send(user).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

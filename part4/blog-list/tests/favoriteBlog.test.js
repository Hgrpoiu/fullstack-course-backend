const favoriteBlog = require("../utils/list_helper").favoriteBlog;
const blogs = require("./testHelper").blogs;

describe("Favorite Blog Tests", () => {
  test("No Blogs", () => {
    expect(favoriteBlog([])).toEqual({ tittle: "n/a", author: "n/a", likes: 0 });
  });

  test("One Blog", () => {
    expect(favoriteBlog([blogs[0]])).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("Many Blogs", () => {
    expect(favoriteBlog(blogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

const totalLikes = require("../utils/list_helper").totalLikes;
const blogs=require('./testHelper').blogs

describe("Total Likes", () => {
  test("Zero likes", () => {
    expect(totalLikes([])).toBe(0);
  });

  test("Some likes", () => {
    expect(totalLikes(blogs)).toBe(36);
  });

  test("One input", () => {
    expect(
      totalLikes([blogs[0]])
    ).toBe(7);
  });
});

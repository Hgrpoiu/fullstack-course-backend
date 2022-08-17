const blogs=require("./testHelper").blogs
const mostBlogs=require("../utils/list_helper").mostBlogs

describe('Test for most authors function',()=>{
    test('Zero test',()=>{
        expect(mostBlogs([])).toEqual({
            author: "n/a",
            blogs: 0
          })
    })

    test('One blog Test',()=>{
        expect(mostBlogs([blogs[0]])).toEqual({author: "Michael Chan",blogs:1})
    })

    test('Many blog test',()=>{
        expect(mostBlogs(blogs)).toEqual({author:'Robert C. Martin',blogs:3})
    })
})
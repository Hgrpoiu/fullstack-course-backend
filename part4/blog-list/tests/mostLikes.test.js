const blogs=require("./testHelper").blogs
const mostLikes=require("../utils/list_helper").mostLikes

describe('Test for most likes function',()=>{
    test('Zero test',()=>{
        expect(mostLikes([])).toEqual({
            author: "n/a",
            likes: 0
          })
    })

    test('One blog Test',()=>{
        expect(mostLikes([blogs[0]])).toEqual({author: "Michael Chan",likes:7})
    })

    test('Many blog test',()=>{
        expect(mostLikes(blogs)).toEqual({author:'Edsger W. Dijkstra',likes:17})
    })
})
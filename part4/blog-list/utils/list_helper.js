const dummy = (blogs) => {
  return 1;
};

function totalLikes(blogs) {
  return blogs.reduce((prev, blog) => {
    return prev + blog.likes;
  }, 0);
}

function favoriteBlog(blogs) {
  function formatter(blog) {
    return { title: blog.title, author: blog.author, likes: blog.likes };
  }

  if (blogs.length === 0) {
    return { tittle: "n/a", author: "n/a", likes: 0 };
  }
  function ascSort(blog1, blog2) {
    return blog1.likes - blog2.likes;
  }

  return formatter(blogs.sort(ascSort)[blogs.length - 1]);
}

function mostBlogs(blogs) {
  if (blogs.length === 0) {
    return {
      author: "n/a",
      blogs: 0,
    };
  }

  let authors = new Map();
  //Count each blog for each author
  blogs.forEach((blog) => {
    if (authors.has(blog.author)) {
      authors.set(blog.author, authors.get(blog.author) + 1);
    } else {
      authors.set(blog.author, 1);
    }
  });

  let highAuthor = authors.keys().next().value;
  let highest = authors.get(highAuthor);

  authors.forEach((value, key) => {

    if (highest < value) {
      highest = value;
      highAuthor = key;
    }
  });

  return { author: highAuthor, blogs: highest };
}

function mostLikes(blogs) {
    if (blogs.length === 0) {
      return {
        author: "n/a",
        likes: 0,
      };
    }
  
    let authors = new Map();
    //Count each blog for each author
    blogs.forEach((blog) => {
      if (authors.has(blog.author)) {
        authors.set(blog.author, authors.get(blog.author) + blog.likes);
      } else {
        authors.set(blog.author, blog.likes);
      }
    });
  
    let highAuthor = authors.keys().next().value;
    let highest = authors.get(highAuthor);
  
    authors.forEach((value, key) => {
  
      if (highest < value) {
        highest = value;
        highAuthor = key;
      }
    });
  
    return { author: highAuthor, likes: highest };
  }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((previous, current) => previous + current.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog);
}

const mostBlogs = (blogs) => {
    var authorBlogCount = {}
    blogs.forEach((blog) => {
        if (authorBlogCount.hasOwnProperty(blog.author)) {
            authorBlogCount[blog.author]++
        } else {
            authorBlogCount[blog.author] = 1
        }
    })


    var mostActiveAuthor = Object.keys(authorBlogCount).reduce(
        (mostActiveAuthor, author) => authorBlogCount[author] > authorBlogCount[mostActiveAuthor] ? author : mostActiveAuthor,
        Object.keys(authorBlogCount)[0]);


    return {
        author: mostActiveAuthor,
        blogs: authorBlogCount[mostActiveAuthor]
    }
}

const mostLikes = (blogs) => {
    var authorBlogLikes = {}
    blogs.forEach((blog) => {
        if (authorBlogLikes.hasOwnProperty(blog.author)) {
            authorBlogLikes[blog.author] += blog.likes
        } else {
            authorBlogLikes[blog.author] = blog.likes
        }
    })

    var mostPopularAuthor = Object.keys(authorBlogLikes).reduce(
        (mostPopularAuthor, author) => authorBlogLikes[author] > authorBlogLikes[mostPopularAuthor] ? author : mostPopularAuthor,
        Object.keys(authorBlogLikes)[0]);


    return {
        author: mostPopularAuthor,
        blogs: authorBlogLikes[mostPopularAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "test1",
        author: "sep",
        url: "url1",
        likes: 3
    },
    {
        title: "test2",
        author: "jeff",
        url: "url2",
        likes: 4
    },
]

const nonExistingId = async () => {
    const note = new Blog({
        title: "toberemoved",
        author: "toberemoved",
        url: "toberemoved",
        likes: 1
    })
    await note.save()
    await note.remove()

    return note._id.toString()
}

const blogsInDb = async () => {
    const notes = await Blog.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initialBlogs: initialBlogs, nonExistingId, blogsInDb
}

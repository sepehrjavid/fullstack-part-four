const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const users = await User.find({})
    const selectedUser = users[0]

    blog.user = selectedUser._id
    const savedBlog = await blog.save()
    selectedUser.blogs = selectedUser.blogs.concat(savedBlog._id)
    await selectedUser.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const newBlog = {
        title: request.body.title,
        url: request.body.url,
        likes: request.body.likes,
        author: request.body.author
    }

    const updatedContact = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true, runValidators: true})
    response.json(updatedContact)
})

module.exports = blogsRouter

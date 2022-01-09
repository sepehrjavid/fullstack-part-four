const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
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

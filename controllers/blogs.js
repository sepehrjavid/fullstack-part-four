const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const blog = new Blog(request.body)

    const user = request.user

    blog.user = user._id
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    const user = request.user

    if (blog === null) {
        response.status(404).json({error: 'blog not found'})
        return
    }

    if (blog.user.toString() === user._id.toString()) {
        blog.remove()
        response.status(204).end()
    } else {
        response.status(403).json({error: 'user is not the owner of the blog'})
    }
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

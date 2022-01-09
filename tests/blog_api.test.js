const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)


const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned with correct length', async () => {
    const response = await api.get('/api/blogs').expect(200)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs have id as identifier', async () => {
    const response = await api.get('/api/blogs').expect(200);

    expect(response.body[0].id).toBeDefined()
})


test('blogs are created successfully', async () => {
    const newBlog = {
        title: "new",
        author: "new",
        url: "new",
        likes: 1
    }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)

    dbBlogs = await helper.blogsInDb()

    expect(dbBlogs).toHaveLength(helper.initialBlogs.length + 1)

    const createdBlog = response.body
    delete createdBlog.id
    expect(createdBlog).toEqual(newBlog)
})

test('default like value for like', async () => {
    const newBlog = {
        title: "new",
        author: "new",
        url: "new"
    }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)

    const createdBlog = response.body
    expect(createdBlog.likes).toBe(0)
})


test('title requirement test', async () => {
    const newBlog = {
        author: "new",
        url: "new"
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
})

test('url requirement test', async () => {
    const newBlog = {
        title: "new",
        author: "new",
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})

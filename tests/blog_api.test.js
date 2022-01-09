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


describe('Listing Blog', () => {
    test('Length checksum of the returned blogs', async () => {
        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('Checksum for the id field to be named correctly', async () => {
        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body[0].id).toBeDefined()
    })
})


describe('Adding Blog', () => {
    test('400 status without url field', async () => {
        const newBlog = {
            title: "new",
            author: "new",
        }
        await api.post('/api/blogs').send(newBlog)
            .expect(400)
    })

    test('400 status without title field', async () => {
        const newBlog = {
            author: "new",
            url: "new"
        }
        await api.post('/api/blogs').send(newBlog)
            .expect(400)
    })

    test('Default value for like should be zero', async () => {
        const newBlog = {
            title: "new",
            author: "new",
            url: "new"
        }
        const response = await api.post('/api/blogs').send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const createdBlog = response.body
        expect(createdBlog.likes).toBe(0)
    })

    test('Successful Blog creation', async () => {
        const newBlog = {
            title: "new",
            author: "new",
            url: "new",
            likes: 1
        }
        const response = await api.post('/api/blogs').send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        dbBlogs = await helper.blogsInDb()
        expect(dbBlogs).toHaveLength(helper.initialBlogs.length + 1)

        const createdBlog = response.body
        delete createdBlog.id
        expect(createdBlog).toEqual(newBlog)
    })

})


describe('Deleting Blog', () => {
    test('Check for successful delete', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToDelete = initialBlogs[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

        const finalBlogs = await helper.blogsInDb()

        expect(finalBlogs).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = finalBlogs.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })

    test('Checksum for 400 if invalid id', async () => {
        await api.delete('/api/blogs/dummy').expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})

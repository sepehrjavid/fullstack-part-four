const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)


const Blog = require('../models/blog')
const User = require('../models/user')

const globals = {}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = helper.initialUsers[0]
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(user.password, saltRounds)

    const userObject = new User({
        username: user.username,
        name: user.name,
        passwordHash,
    })

    const savedUser = await userObject.save()
    const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
    }

    let blogObject = new Blog(helper.initialBlogs[0])
    blogObject.user = savedUser._id
    let savedBlog = await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    blogObject.user = savedUser._id
    savedUser.blogs = savedUser.blogs.concat(savedBlog._id)
    await blogObject.save()

    await savedUser.save()

    globals.token = `Bearer ${jwt.sign(userForToken, process.env.SECRET)}`
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
        await api.post('/api/blogs').send(newBlog).set('Authorization', globals.token)
            .expect(400)
    })

    test('400 status without title field', async () => {
        const newBlog = {
            author: "new",
            url: "new"
        }
        await api.post('/api/blogs').send(newBlog).set('Authorization', globals.token)
            .expect(400)
    })

    test('Default value for like should be zero', async () => {
        const newBlog = {
            title: "new",
            author: "new",
            url: "new"
        }
        const response = await api.post('/api/blogs').send(newBlog).set('Authorization', globals.token)
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
        const response = await api.post('/api/blogs').send(newBlog).set('Authorization', globals.token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        dbBlogs = await helper.blogsInDb()
        expect(dbBlogs).toHaveLength(helper.initialBlogs.length + 1)

        const createdBlog = response.body
        delete createdBlog.id
        delete createdBlog.user
        expect(createdBlog).toEqual(newBlog)
    })

})


describe('Deleting Blog', () => {
    test('Check for successful delete', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToDelete = initialBlogs[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', globals.token).expect(204)

        const finalBlogs = await helper.blogsInDb()

        expect(finalBlogs).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = finalBlogs.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })

    test('Checksum for 400 if invalid id', async () => {
        await api.delete('/api/blogs/dummy').expect(400).set('Authorization', globals.token)
    })
})

describe('Updating Blog', () => {
    test('Check for successful delete', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToUpdate = initialBlogs[0]

        blogToUpdate.title = "updated"

        await api.put(`/api/blogs/${blogToUpdate.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const updateBlogs = await helper.blogsInDb()
        const titles = updateBlogs.map(r => r.title)
        expect(titles).not.toContain(blogToUpdate.title)
    })

    test('Checksum for 400 if invalid id', async () => {
        await api.put('/api/blogs/dummy').expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})

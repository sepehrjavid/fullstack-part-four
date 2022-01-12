const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)


const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
})


describe('User Creation', () => {
    test('Successful User Creation', async () => {
        const newUser = {
            username: "sep",
            password: "123",
            name: "sep"
        }
        const response = await api.post('/api/users').send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersInDb = await helper.usersInDb()

        expect(usersInDb).toHaveLength(1)
    })

    test('Creation error without username', async () => {
        const newUser = {
            password: "123",
            name: "sep"
        }

        await api.post('/api/users').send(newUser).expect(400)
    })

    test('Creation error with username length less than 3', async () => {
        const newUser = {
            username: "s",
            password: "123",
            name: "sep"
        }

        await api.post('/api/users').send(newUser).expect(400)
    })

    test('Creation error without password', async () => {
        const newUser = {
            username: "sep",
            name: "sep"
        }

        await api.post('/api/users').send(newUser).expect(400)
    })

    test('Creation error with password length less than 3', async () => {
        const newUser = {
            password: "12",
            username: "sep",
            name: "sep"
        }

        await api.post('/api/users').send(newUser).expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})


describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
})


describe('favorite blog', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17a6',
            title: 'How to excel at security',
            author: 'Sepehr Javid',
            url: 'sep.com',
            likes: 7,
            __v: 0
        }
    ]

    test('the sepehr blog should be returned', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual({
            _id: '5a422aa71b54a676234d17a6',
            title: 'How to excel at security',
            author: 'Sepehr Javid',
            url: 'sep.com',
            likes: 7,
            __v: 0
        })
    })
})


describe('most blogs', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17a6',
            title: 'How to excel at security',
            author: 'Sepehr Javid',
            url: 'sep.com',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234f17a6',
            title: 'How to excel at security 2',
            author: 'Sepehr Javid',
            url: 'sep.com',
            likes: 5,
            __v: 0
        }
    ]

    test('sepehr author should be returned', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({
            author: 'Sepehr Javid',
            blogs: 2
        })
    })
})


describe('most likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 13,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17a6',
            title: 'How to excel at security',
            author: 'Sepehr Javid',
            url: 'sep.com',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234f17a6',
            title: 'How to excel at security 2',
            author: 'Sepehr Javid',
            url: 'sep.com',
            likes: 5,
            __v: 0
        }
    ]

    test('Edsger W. Dijkstra author should be returned', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 13
        })
    })
})


import request from "supertest"
import { app } from '../../src/app.ts'

describe("fruits API", () => {
    
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    describe('/GET /fruits', () => {
        it('should return 200 and empty array', async () => {
            await request(app)
            .get('/fruits')
            .expect(200, [])

        })
    })

    describe('/GET /fruits/:id', () => {    
        it('should return 404 for non-existing fruit', async () => {
            await request(app)
            .get('/fruits/423141234')
            .expect(404)

        })
    })
    let createdFruit: any = null;
    describe('/POST /fruits', () => {
        describe('incorrect data test', () => {

            afterEach(async () => {
                await request(app)
                .get('/fruits')
                .expect(200,[])
            })

            it('should not create new fruit with incorrect name', async () => {
                await request(app)
                .post('/fruits')
                .send({name: '', amount: 3})
                .expect(400)

            })

            it('should not create new fruit with incorrect amount', async () => {
                await request(app)
                .post('/fruits')
                .send({name: 'pear', amount: -3})
                .expect(400)
            })
        })
        describe('correct data test', () => {
            it('should create fruit with some data', async () => {
                const response = await request(app)
                    .post('/fruits')
                    .send({name: 'peach', amount: 35})
                    .expect(201)

                createdFruit = response.body
                expect(createdFruit).toEqual({
                    id: expect.any(Number),
                    name: 'peach',
                    amount: 35
                })

                await request(app)
                    .get(`/fruits/${createdFruit.id}`)
                    .expect(200, {
                        id: createdFruit.id,
                        name: 'peach',
                        amount: 35
                    })
            })
        })
    })

    describe('/PUT /fruits/:id', () => {
        describe('incorrect data test', () => {
            it('should not update fruit with incorrect id', async () => {
                await request(app)
                    .put('/fruits/52345324523')
                    .send({name: 'banan', amount: 3})
                    .expect(404)
            })

            it('should not update fruit with incorrect name', async () => {
                await request(app)
                    .put(`/fruits/${createdFruit.id}`)
                    .send({name: '', amount: 3})
                    .expect(400)

                await request(app)
                    .get(`/fruits/${createdFruit.id}`)
                    .expect(200, createdFruit)
                
            })
        })
        describe('correct data test', () => {
            it('should update fruit with some data', async () => {
                await request(app)
                    .put(`/fruits/${createdFruit.id}`)
                    .send({name: 'banan', amount: 3})
                    .expect(200)
                
                await request(app)
                    .get(`/fruits/${createdFruit.id}`)
                    .expect(200, {
                        id: createdFruit.id,
                        name: 'banan',
                        amount: 3
                    })
            })
        })
    })
    describe('/DELETE /fruits/:id', () => {
        describe('incorrect data test', () => {
            it('should not delete fruit with incorrect id', async () => {
                await request(app)
                    .delete('/fruits/52345324523')
                    .expect(404)
            })
        })

        describe('correct data test', () => {
            it('should delete created fruit', async () => {
                await request(app)
                    .delete(`/fruits/${createdFruit.id}`)
                    .expect(204)
            })

            it('fruits array should be empty after all', async () => {
                await request(app)
                    .get(`/fruits`)
                    .expect(200,[])
            })
        })


    })
})
import express from 'express'

const app = express()
const port = 8080 

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)

const db = {
    lessons : [
        {id: 1, lesson:"Math"},
        {id: 2, lesson:"PE"},
        {id: 3, lesson:"Geography"},
        {id: 4, lesson:"IT"},
        {id: 5, lesson:"Физикс"},
    ]}

app.get('/', (req, res) => {
    res.send('Welcome')
})

app.get('/schedule', (req, res) => {
    let foundLessons = db.lessons
    if (req.query.title){
        foundLessons = foundLessons
            .filter(x => x.lesson.indexOf(req.query.title as string) > -1)
    }
    if (foundLessons){
        res.json(foundLessons)
    } else {
        res.sendStatus(404)
    }
})

app.get('/schedule/:id', (req, res) => {
    const foundLessons = db.lessons.find(x => x.id === Number(req.params.id)) 
    if (foundLessons){
        res.json(foundLessons)
    } else {
        res.sendStatus(404)
    }
})

app.post('/schedule', (req, res) => {
    let lesson = req.body.lesson as string
    lesson = lesson.trim()
    if(!lesson){
        res.sendStatus(400)
        return;
    }
    const new_lesson = {
        id: +(new Date()),
        lesson
    }
 db.lessons.push(new_lesson)
    res.status(201).json(new_lesson)
})

app.delete('/schedule/:id', (req, res) => {
    const foundLessons = db.lessons.filter(x => x.id !== Number(req.params.id)) 
    if (foundLessons.length !== db.lessons.length){
     db.lessons = foundLessons
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

app.put('/schedule/:id', (req, res) => {
    if ((req.body.lesson ?? '').trim() === ''){
        res.sendStatus(400) 
        return;
    }
    req.body.lesson = req.body.lesson.trim()
    const index = db.lessons.findIndex(x => x.id === Number(req.params.id)) 
    if (index == -1){
        res.sendStatus(404)
        return;
    }
    db.lessons[index]!.lesson = req.body.lesson
    res.status(200)
    res.json(db.lessons[index])
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
 
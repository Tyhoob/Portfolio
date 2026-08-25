import { app } from "./app.js"

const port = process.env.PORT || 8080

const server = app.listen(port,() => {
    console.log(`Server listening on port ${port}`)
})
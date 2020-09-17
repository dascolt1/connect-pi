const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const userRouter = require('./routers/user')
const path = require('path')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))

const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())

//user routes found in ./routers/user
app.use(userRouter)

//not found middleware
app.use((req, res, next) => {
    const err = new Error(`URL ${req.originalUrl} not found`);
    res.status(404).send({error: `URL ${req.originalUrl} not found`});
    next(err);
});

//Starts server
app.listen(port, () => {
	console.log(`Port is live on ${port}`)
})
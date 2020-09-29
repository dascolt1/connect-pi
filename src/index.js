const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const userRouter = require('./routers/user')
const path = require('path')
const hbs = require('hbs')
const session = require('express-session')
const passport = require('passport')
var bodyParser = require('body-parser')
const flash = require('connect-flash')
const { ensureAuthenticated } = require('./middleware/auth')
require('./middleware/passport')(passport)

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')))

const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(session({
    secret: '1694pennington',
    resave: true,
    saveUninitialized: true
  }))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// app.use((req, res, next) => {
//     res.locals.errors = userFacingErrors;
//     res.locals.errors_msg = req.flash('error_msg');
//     next();
// })

//user routes found in ./routers/user
app.use(userRouter)

app.get('/login', (req, res) => {
    res.render('login', {
        error: req.flash('error')
    })
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/', ensureAuthenticated, (req, res) => {
    //console.log(req.user)
    res.render('dashboard')
})

app.get('/profile', (req, res) => {
    res.render('profile')
})

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
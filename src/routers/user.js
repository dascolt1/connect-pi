const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const passport = require('passport')
const validator = require('validator')
const { ensureAuthenticated } = require('../middleware/auth')

//multer options config
const upload = multer({
	limits: {
		fileSize: 100000000
	},
	fileFilter(req, file, cb){
		if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
			cb(new Error('PLease upload an image'))
		}
		cb(undefined, true)
	}
})

router.get('/test', (req, res) => {
	res.send('from a new file')
})

//post request to USERS
//signs up and creates user
router.post('/register', async (req, res) => {
	const { password, email } = req.body
	
	const user = new User(req.body)
	try {
		await user.save()
		//req.flash('success_msg', 'You are registered!')
		res.redirect('/login')
	} catch (e) {
		const { errors } = e
		let userFacingErrors = []
		console.log(e)
		//handles mongo sanitation and passes to front end
		for(var key in errors) {
			if(errors.hasOwnProperty(key)){
				userFacingErrors.push({error: errors[key].message})
			}
		}

		//if(errors.)
		res.render('register', {
			userFacingErrors
		})
	}

})

//logs in user
router.post('/brothers/login', async (req, res, next) => {
        passport.authenticate('local', {
			successRedirect:'/',
			failureRedirect: '/login',
			failureFlash: true
		})(req, res, next)
})

//logs out a user by erasing token
router.get('/brothers/logout', async (req, res) => {
	req.logout()
	res.redirect('/login')
})

//gets user profile
router.get('/brothers/me', ensureAuthenticated, async (req, res) => {
    res.send(req.user)
    let {name, email, field, city, _id} = req.user
    res.render('profile', {
        name,
        field,
        city,
        _id
    })
})

//gets all brothers in db
router.get('/brothers', async (req, res) => {
    if(req.query.name) {
        const name = req.query.name
		const users = await User.find({ "lastName": name })
        res.render('roster', {
            users,
			title: "Brothers of Sigma Pi",
			id: users._id
        })
    }else {
        const users = await User.find()
        //const id = req.user.id
        res.render('roster', {
            users,
            title: "Brothers of Sigma Pi"
        })
        //console.log(id)
    }
    
})

//updates users
router.patch('/brothers/me', async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['name', 'email', 'password', 'field', 'city']
	const isValidOperaion = updates.every((update) =>  allowedUpdates.includes(update))

	if(!isValidOperaion) {
		return res.status(400).send({ error: "Invalid updates" })
	}

	try {
		updates.forEach((update) => req.user[update] = req.body[update])
		await req.user.save()
		res.send(req.user)
	} catch(e) {
		res.status(400).send(e)
	}
})

//deletes user
router.delete('/brothers/me', async (req, res) => {
	try {
		await req.user.remove()
		res.send(req.user);
	}catch(e) {
		res.status(500).send(e);
	}
})

//uploads profile image 
router.post('/brothers/me/avatar', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({ width: 150, height: 200 }).png().toBuffer()
	req.user.avatar = buffer
	await req.user.save()
	//res.send(buffer)
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message })
})

//deletes prof pic
router.delete('/brothers/me/avatar', async (req, res) => {
	req.user.avatar = undefined
	await req.user.save()
	res.send()
})

router.get('/brothers/:id/avatar', async (req, res) => {
	try{
		const user = await User.findById(req.params.id)

		if(!user || !user.avatar){
			throw new Error()
		}

		//sets header to image content type
		//then sends back avatar img
		//can use this url in image tag to serve image
		res.set('Content-Type', 'image/png')
		res.send(user.avatar)
	}catch(e){
		res.status(404).send()
	}
})

module.exports = router;
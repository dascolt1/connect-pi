const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

//multer options config
const upload = multer({
	limits: {
		fileSize: 1000000
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
router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		const token = await user.generateAuthToken()
        await user.save()
		res.status(201).send({ user, token })
	} catch (e) {
		res.status(400).send(e)
	}

})

//logs in user
router.post('/users/login', async (req, res) => {
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()

        //res.send({ user, token })
        res.redirect('/users')
	}catch(e) {
		res.status(400).send()
	}
})

//logs out a user by erasing token
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})
		await req.user.save()

		res.send()
	}catch (e) {
		res.status(500).send()
	}
})

//logs out user on all devices
router.post('/users/logoutAll', auth, async (req, res) => {
	try{
		req.user.tokens = []

		await req.user.save()
		res.send()
	}catch(e) {
		res.status(500).send()
	}
})

//gets user profile
router.get('/users/me', auth, async (req, res) => {
    //res.send(req.user)
    let {name, email, field, city} = req.user
    res.render('profile', {
        name,
        field,
        city
    })
})

//gets all brothers in db
router.get('/users', auth, async (req, res) => {
    const users = await User.find()
    res.render('roster', {
        users,
        title: "Brothers"
    })
    console.log(users)
})

//updates users
router.patch('/users/me', auth, async (req, res) => {
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
router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove()
		res.send(req.user);
	}catch(e) {
		res.status(500).send(e);
	}
})

//uploads profile image 
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
	req.user.avatar = buffer
	await req.user.save()
	res.send()
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message })
})

//deletes prof pic
router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined
	await req.user.save()
	res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
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
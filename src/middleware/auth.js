const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
	try {
		//gets token from header
		//then decodes jwt token using special password '1694pennington'
        //then finds user by id and puts the token as token
        const token = req.header('Authorization').replace('Bearer ', '')
		const decoded = jwt.verify(token, '1694pennington')
		const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

		if(!user){
			throw new Error()
		}
		//assigns token to req.token
		//then sets user object to req to be used in routers
		req.token = token
		req.user = user
		next()
	}catch (e){
		res.status(401).send({ error: 'Please authenticate'})
	}
}

module.exports = auth
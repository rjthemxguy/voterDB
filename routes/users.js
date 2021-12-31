const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('config');




// @route 	POST 	api/users
// @desc 	Register a user
// @access	Public

router.post('/',
[
	// Validate user info
	check('name','Name is required').not().isEmpty(),
	check('email', 'Please include a valid email').isEmail(),
	check('password', 'Please enter a password with 6 or more characters').isLength({min:6})
],

async (req,res) => {
	// If validation errors
	const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).json({errors:errors.array()});
	
		}

		// Get info from req.body
		const {name, email, password} = req.body;

		try {

		     // See if user already exists
			 let user = await User.findOne({email});

			 // If yes, error out
			 if(user) {
				 return res.status(400).json({msg : "User already exists"})
			 }

			 // Build user from body info
			 user = new User ({
				 name,
				 email,
				 password
			 });

			 // Create salt
			 const salt = await bcrypt.genSalt(10);
			 
			 // Hash password
			 user.password = await bcrypt.hash(password, salt);

			 // Save user in database
			 await user.save();

			 // Insert User.id into payload for JWT
			 const payload = {
				 user : {
					 id:user.id
				 }
			 }

			// Create token 	
			jwt.sign(payload, config.get('jwtSecret'), {
				expiresIn:3600
			},(err, token) => {
				if(err) throw err;
				// Send token back
				res.json({token});
			})

		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}

	}

);


module.exports = router;





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
		const {name, email, password, isActive, isAdmin, county} = req.body;

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
				 password,
				 isActive,
				 isAdmin,
				 county
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
			res.status(500).send("Register Server Error: " + err.message);
		}

	}

);

router.get('/', async(req,res) => {

   
    try {
        // Get Users
        const users = await User.find();
        // Send contact back in JSON
        res.json(users);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Getting Users');

    }

});

// @route       PUT    api/users/:id 
// @desc        Update User
// @access      Private

router.put('/:id', async (req,res) => {

    const {name, email, password, isActive, isAdmin, county} = req.body;

    // Build contact based on changed fields
    const userFields = {};

    if(name) userFields.name = name;
    if(email) userFields.email = email;
    userFields.isActive = isActive;
    if(isAdmin) userFields.isAdmin = isAdmin;
	if(county) userFields.county = county;
    
    try {

        // Get user
        let user = await User.findById(req.params.id);

        // Does it exist
        if(!user) return res.status(404).json({msg:"Update User not found"});


        // Update contact
        user = await User.findByIdAndUpdate(
            req.params.id,
            {$set: userFields},
            {new: true}
        );

        res.send(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in User Update: ' + err.message);
    }

});

module.exports = router;





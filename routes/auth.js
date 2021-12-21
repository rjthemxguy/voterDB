const express = require('express');
const router = express.Router();


// @route       GET    api/auth
// @desc        Get a logged in user
// @access      Private

router.get('/', (reg,res) => {

res.send('Get logged in user');
});

// @route       POST    api/auth 
// @desc        Auth user and get token
// @access      Public

router.post('/', (reg,res) => {

res.send('Register a user');
});


module.exports = router;

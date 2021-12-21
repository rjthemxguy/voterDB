const express = require('express');
const router = express.Router();


// @route       GET    api/contacts 
// @desc        Get all users contacts
// @access      Private

router.get('/', (reg,res) => {

res.send('Get all contacts');
});

// @route       POST    api/contacts 
// @desc        Add new contact
// @access      Private

router.post('/', (reg,res) => {

res.send('Add new contact');
});

// @route       PUT    api/contacts/:id 
// @desc        Update contact 
// @access      Private

router.put('/:id', (reg,res) => {

res.send('Update a contact');
});


// @route       DELETE    api/contacts/:id 
// @desc        Update contact 
// @access      Private  

router.delete('/:id', (reg,res) => {

res.send('Delete a contact');
});




module.exports = router;

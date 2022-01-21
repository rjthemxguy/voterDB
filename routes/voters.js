const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const Voter = require('../models/Voters')
const auth = require("../middleware/auth"); 



// @route       GET    api/contacts 
// @desc        Get all users contacts
// @access      Private

router.get('/', async(req,res) => {

    let last = req.query.last;
    let first = req.query.first;
    let street = req.query.street;
    let house = req.query.house;
    let city = req.query.city;

    console.log(first);
    
    var query ={};

    if(last !== "") {
        query["szNameLast"] = last;
    }

    if(first !== "") {
        query["szNameFirst"] = first;
    }

    if(street !== "") {
        query["szStreetName"] = street;
    }

    if(house !== "") {
        query["sHouseNum"] = house;
    }

    if(city !== "") {
        query["szSitusCity"] = city;
    }

    console.log(query);
    try {
        // Find voters
        const voters = await Voter.find(query).sort({szStreetName:1});
        // Send contact back in JSON
        res.json(voters);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error Getting Voters');

    }

});

// @route       POST    api/contacts 
// @desc        Add new contact
// @access      Private

router.post('/',[auth, [
    check('name', 'Name is required').not().isEmpty()
    ]
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

const {name,email,phone,type } = req.body;

try {

    // Build contact from vars from req.body and user.id from token
    const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
         
    });

    // Save to database
    const contact = await newContact.save();
    // Send new contact back
    res.send(contact);

} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error in New Contact');
}

});

// @route       PUT    api/contacts/:id 
// @desc        Update contact 
// @access      Private

router.put('/:id',auth, async (req,res) => {

    const {name,email,phone,type } = req.body;

    // Build contact based on changed fields
    const contactFields = {};

    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    
    try {

        // Get contact
        let contact = await Contact.findById(req.params.id);

        // Does it exist
        if(!contact) return res.status(404).json("msg:Contact not found");

        // Does it belong to current user    
        if(contact.user.toString() != req.user.id) {
            return res.status(401).json({msg:"Not authorized"});
        }

        // Update contact
        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {$set: contactFields},
            {new: true}
        );

        res.send(contact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in Contact Update');
    }

});


// @route       DELETE    api/contacts/:id 
// @desc        Update contact 
// @access      Private  

router.delete('/:id', auth, async (req,res) => {


try {
    //Get contact
    let contact = await Contact.findById(req.params.id);

    // Does it exist?
    if(!contact) return res.status(404).json("msg:Contact not found");

    // 
    if(contact.user.toString() != req.user.id) {
        return res.status(401).json({msg:"Not authorized"});
    }

    await Contact.findByIdAndRemove(req.params.id);
    res.json({msg:"Contact removed"});


} catch (err) {
    
}

});




module.exports = router;

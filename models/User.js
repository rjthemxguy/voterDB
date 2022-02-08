const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
       
	name: {
		type:String,
		required: true
		},
	 email: {
                type:String,
                required: true,
		unique:true
                },
	 password: {
                type:String,
                required: true
                },
	 date: {
                type:Date,
                default: Date.now
                },
        isAdmin: {
                type: Boolean
        },

        isActive: {
                type:Boolean
        },

        county: {
                type: String
        }
});

module.exports =  mongoose.model('user',UserSchema);





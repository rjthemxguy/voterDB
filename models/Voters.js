const mongoose = require('mongoose');

const VoterSchema = mongoose.Schema ({
    
	szNameLast: {
		type:String
		},

	szNameFirst: {
        type:String
         },

    szNameMiddle: {
        type:String
    },

    sHouseNum: {
        type:String
    },

    szStreetName: {
        type:String
    },

	
    szSitusCity: {
        type:String
    
    }

   
});

module.exports =  mongoose.model('voter',VoterSchema);
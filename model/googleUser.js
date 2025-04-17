const mongoose = require('mongoose');

const googleSchema = mongoose.Schema({
    gid:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    image:{
        url:{
            type:String,
            require:true
        }
    },
    role:{
        type: String,
        default:'student'
    }
},{timestamps:true})

const googleauthmodel = mongoose.model('googleUser',googleSchema);
module.exports = googleauthmodel;
const jwt = require('jsonwebtoken');
const UserModel = require('../model/user');

const islogin = async (req,res,next) =>{
    const {token} = req.cookies;
    console.log(token);
    
}

module.exports = islogin;
const jwt = require('jsonwebtoken');

const adminAuth = (role) => {
    return(req,res,next)=>{
        if(!role.includes(req.userdata.role)){
            req.flash('authError',"Unauthorized Access!");
            res.redirect('/');
        }
        next();
    }
}

module.exports = adminAuth;
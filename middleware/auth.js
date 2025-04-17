const jwt = require('jsonwebtoken');
const UserModel = require('../model/user');
const googleauthmodel = require('../model/googleUser');


const checkAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        req.flash('authError', "Unauthorized user please login first!");
        return res.redirect('/');
    }
    try {
        const verifyLogin = jwt.verify(token, 'gaurav$#'); // It will verify token

        // First try to find the user in UserModel
        const userData = await UserModel.findOne({ _id: verifyLogin.ID });

        // Then try to find the user in googleauthmodel
        const googleUserData = await googleauthmodel.findOne({ _id: verifyLogin.ID });

        // If neither userData nor googleUserData exists, redirect to login
        if (!userData && !googleUserData) {
            req.flash("authError", "User not found, please login again!");
            return res.redirect('/');
        }

        // Set the user data to req.userdata
        req.userdata = userData || googleUserData; // If userData exists, use it; otherwise use googleUserData
        next(); // Proceed to the next middleware
    } catch (error) {
        req.flash("authError", "Session expired, please login again!");
        return res.redirect('/');
    }
};


module.exports = checkAuth;
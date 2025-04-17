const UserModel = require('../model/user') //required database from model
const CourseModel = require('../model/course') //required database from model course  
const bcrypt = require('bcrypt'); //for password encryption
const cloudinary = require('cloudinary') //image upload
const fileUpload = require('express-fileupload') //for file upload
const jwt = require('jsonwebtoken'); //validation token
const checkAuth = require('../middleware/auth'); //get check auth from middleware
const { hasSubscribers } = require('diagnostics_channel');
const { stdout } = require('process');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const GoogleStrategy = require('passport-google-oauth20');
const googleauthmodel = require('../model/googleUser');
const passport = require('passport');


//cloudinary configuration for image file upload
cloudinary.config({
    cloud_name: 'dll5kqstq',
    api_key: '538369545927589',
    api_secret: '-Yb0q6W0pLcrcqsGp78rmTBMpCM' // Click 'View API Keys' above to copy your API secret
});

class FrontController {
    //login
    static login = async (req, res) => {
        try {
            res.render('login', { message: req.flash('success'), message2: req.flash('invalidEmail'), message3: req.flash('passError'), message4: req.flash('authError')});
        } catch (error) {
            console.log(error);
        }
    }
    //register
    static register = async (req, res) => {
        try {
            res.render('register', { message: req.flash('passmatcherror')});
        } catch (error) {
            console.log(error);
        }
    }

    //home
    static home = async (req, res) => {
        try {
            const { name, email, image, id } = req.userdata; //get userdata call from auth middleware
            //console.log(req.userdata); //check if we are getting data or not
            const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
            const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
            const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
            let user = await UserModel.findById(id);
            if (!user) {
                user = await googleauthmodel.findById(id);
            }
            res.render('home', { n: name, i: image, u: user, e: email, btech: btech, bca: bca, mca: mca });
        } catch (error) {
            console.log(error)
        }
    }

    //about
    static about = async (req, res) => {
        try {
            const { name, image, id } = req.userdata;
            let user = await UserModel.findById(id);
            if (!user) {
                user = await googleauthmodel.findById(id);
            }
            res.render('about', { n: name, i: image, u: user })
        } catch (error) {
            console.log(error)
        }
    }

    //contact
    static contact = async (req, res) => {
        try {
            const { name, image, id } = req.userdata;
            let user = await UserModel.findById(id);
            if (!user) {
                user = await googleauthmodel.findById(id);
            }
            res.render('contact', { n: name, i: image, u: user, message: req.flash('success') })
        } catch (error) {
            console.log(error)
        }
    }

      // Google Authentication Route
  static googleAuth = (req, res, next) => {
    // Redirect the user to Google's OAuth2 login page
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  };

  static googleLogin = (req, res, next) => {
    // Handle the Google OAuth callback
    passport.authenticate('google', {
      failureRedirect: '/'  // it will redirect to home or a failure page if authentication fails
    }, async (err, user) => {
      if (err) {
        // Handle error
        console.log('Error during Google Authentication:', err);
        return res.status(500).send('Something went wrong');
      }
  
      if (!user) {
        //if no user found
        return res.redirect('/');
      }
  
      // it will check if the email is verified
      if (user.email_verified === false) {
        // If email is not verified, redirect to a specific page or show an error
        req.flash('error', 'Please verify your email before logging in.');
        return res.redirect('/');
      }
  
      // Successful login
      try {
        const existUser = await googleauthmodel.findOne({ gid: user.id });
        // console.log(existUser)
        if (existUser) {
          // If user exists, create a token and redirect to the home page
          const token = jwt.sign({ ID: existUser._id }, 'gaurav$#');
          res.cookie('token', token);
          return res.redirect('/home'); // Successful login
        } else {
          // If user does not exist, create a new user record
          await googleauthmodel.create({
            gid: user.id,
            name: user.displayName,
            email: user.emails[0].value,
            image: {
              url: user.photos[0].value,
            }
          });

          const newUser = await googleauthmodel.findOne({ gid: user.id });
          const token = jwt.sign({ ID: newUser._id }, 'gaurav$#');
          res.cookie('token', token);
          return res.redirect('/home'); // Redirect to home after creating new user
        }
      } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to create or find user');
      }
    })(req, res, next); // Invoke the callback function with the request, response, and next middleware
  }

    //insert student resgistration
    static insertStudent = async (req, res) => {
        try {
            const { username, email, password, ConfirmPassword } = req.body;
            //console.log(req.body);
            if (password !== ConfirmPassword) {
                req.flash('passmatcherror', "Passwords do not match");
                return res.redirect('/register');
            }
            const hashPassword = await bcrypt.hash(password, 10); //encypt the password,10 is the saltRounds for bcrypt
            //for cloudinary file upload
            const file = req.files.image;
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "profile"
            });
            //console.log(file); to check if receivig file
            // console.log(imageUpload); to check if image uploading on cloudinary

            await UserModel.create({
                name: username,
                email: email,
                password: hashPassword,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            });
            req.flash('success', "User registered successfully please login!")
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }

    //verify login user
    static verifyLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) {
                req.flash('invalidEmail', "Email not registered!");
                res.redirect('/');
            }
            const passmatch = await bcrypt.compare(password, user.password);
            if (passmatch) {
                if (user.role == 'student') {
                    //for generate the token for student
                    const token = jwt.sign({ ID: user.id }, 'gaurav$#');
                    res.cookie('token', token);
                    res.redirect('/home');
                }
                if (user.role == 'admin') {
                    //for generate the token for admin
                    const token = jwt.sign({ ID: user.id }, 'gaurav$#');
                    res.cookie('token', token);
                    res.redirect('/adminDisplay');
                }

            } else {
                req.flash('passError', "Invalid password!");
                res.redirect('/');
            }
        } catch (error) {

        }
    }

    //forgot password
    static forgotPasswordVerify = async (req, res) => {
        try {
            const { email } = req.body;
            const UserData = await UserModel.findOne({ email });
            //console.log(UserData);
            if (UserData) {
                const randomString = randomstring.generate();
                //console.log(randomString);
                await UserModel.updateOne(
                    { email: email },
                    { $set: { token: randomString } }
                );
                this.sendEmail(UserData.name, UserData.email, randomString);
                req.flash('success', "Please check you email to reset password!");
                res.redirect('/');

            } else {
                req.flash('invalidEmail', "Email not registered!");
                res.redirect('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    static resetPassword = async (req, res) => {
        try {
            const { token } = req.query;
            const tokenData = await UserModel.findOne({ token:token });
            //console.log(tokenData);
            if (tokenData) {
                res.render('passwordReset',{user_id:tokenData._id});
            }else{
               return res.send("404 page not found or Link Expired!");
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    static resetforgotPassword = async (req, res) => {
        try {
            const {password,user_id} = req.body;
            const newHashPassword = await bcrypt.hash(password, 10);
            await UserModel.findByIdAndUpdate(user_id, {
                password: newHashPassword,
                token:'',
            });
            req.flash('success', "Password updated successfully, please login!");
            res.redirect('/');
        } catch (error) {
            
        }
    }

    static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "gaurav.indoriya82@gmail.com",
                pass: "amkm rfcp ztuf lfrv",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: "heelo", // plain text body
            html: "<p>Hii " +
                name +
                ',Please click here to <a href="http://localhost:3000/resetPassword?token=' +
                token +
                '">Reset</a>Your Password.',

        });
    };




    static profile = async (req, res) => {
        try {
            const { name, email, image, id } = req.userdata;

            let user = await UserModel.findById(id);
            let isGoogleAuthUser = false; // Default user is not authenticated via Google
            if (!user) {
                user = await googleauthmodel.findById(id);
                isGoogleAuthUser = true; // Flag that user is authenticated via Google
            }
            res.render('profile', { n: name, i: image, e: email,isGoogleAuthUser, u: user, message: req.flash('success'), message2: req.flash('error') });
        } catch (error) {
            console.log(error);
        }
    }

    static updateProfile = async (req, res) => {
        try {
            const { id } = req.userdata;
            const { name, email } = req.body;
            if (req.files) {
                const user = await UserModel.findById(id);
                const imageID = user.image.public_id;
                await cloudinary.uploader.destroy(imageID); //delete image from cloudinary
                const imagefile = req.files.image;
                const imageUpload = await cloudinary.uploader.upload(
                    imagefile.tempFilePath,
                    {
                        folder: "userprofile"
                    }
                );
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageUpload.public_id,
                        url: imageUpload.secure_url
                    },
                };
            } else {
                var data = {
                    name: name,
                    email: email
                };
            }
            await UserModel.findByIdAndUpdate(id, data);
            req.flash('success', "Profile updated successfully!")
            res.redirect('/profile');
        } catch (error) {
            console.log(error);
        }
    }

    static updatePassword = async (req, res) => {
        try {
            const { id } = req.userdata;
            // console.log(req.body);
            const { oldPassword, newPassword, changedPassword } = req.body;
            if (oldPassword && newPassword && changedPassword) {
                const user = await UserModel.findById(id);
                const passmatched = await bcrypt.compare(oldPassword, user.password);
                //console.log(isMatched)
                if (!passmatched) {
                    req.flash("error", "Current password is incorrect!");
                    res.redirect("/profile");
                } else {
                    if (newPassword != changedPassword) {
                        req.flash("error", "Password does not match!");
                        res.redirect("/profile");
                    } else if (newPassword.length < 6) {
                        req.flash("error", "Password should be minimum 6 characters!");
                        res.redirect("/profile");
                    } else {
                        const newHashPassword = await bcrypt.hash(newPassword, 10);
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword,
                        });
                        req.flash("success", "Password Updated successfully!");
                        res.redirect("/");
                    }
                }
            } else {
                req.flash("error", "All fields are required!");
                res.redirect("/profile");
            }
        } catch (error) {
            console.log(error);
        }

    };

    static logout = async (req, res) => {
        res.clearCookie('token');
        req.flash('success', "You have been logged out!");
        res.redirect('/');
    }


}

module.exports = FrontController;
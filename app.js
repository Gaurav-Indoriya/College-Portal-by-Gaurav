const express = require('express');
//console.log(express); //check express modules
const app = express();
const port = 4000;
const web = require('./routes/web');
const connectdb = require('./database/connectdb'); //calling connectdb function
app.set('view engine', 'ejs'); //html css link
app.use(express.static('public')); //using public folder images/css content
connectdb(); //function called
app.use(express.urlencoded({ extended: false })); // body parser get data from req(input)
const session = require('express-session');
const flash = require("connect-flash"); //for flash message
const fileUpload = require('express-fileupload'); //express package for file upload
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

app.use(fileUpload({
    useTempFiles: true,
}));

app.use(
    session({
        secret:"secret",
        cookie: {maxAge: 30000},
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash()); // function call for flash message

// Cache control middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    // res.set('Pragma', 'no-cache');
    // res.set("Expires", "0");
    next();
  });

// Set up Google OAuth Strategy
app.use(session({
    secret: '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', 
    resave: false, 
    saveUninitialized: true
  }));
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: '106254330693-v677c04hn00fg75lf7abjtl10hv49f3d.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'https://collegeportal-oq2h.onrender.com/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
  
  // Serialize and deserialize user for session handling
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });



app.use('/',web); //route load
//server create
app.listen(port, ()=>{
    console.log(`server started at localhost:${port}`)
});
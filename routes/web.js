const express = require('express');
const FrontController = require('../controller/FrontController');
const CourseController = require('../controller/CourseController');
const route = express.Router();
const checkAuth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const AdminController = require('../controller/AdminController');
const ContactController = require('../controller/ContactConroller');
const islogin = require('../middleware/isLogin');

// Routes for Google Authentication and Login
route.get('/googleAuth', FrontController.googleAuth); // Redirect to Google OAuth login
route.get('/auth/google/callback', FrontController.googleLogin); // Handle the Google callback

//GET routes
route.get('/',FrontController.login);
route.get('/register',FrontController.register);
route.get('/home',checkAuth, FrontController.home);
route.get('/about',checkAuth, FrontController.about);
route.get('/contact',checkAuth, FrontController.contact);
route.get('/logout',checkAuth,FrontController.logout);
route.get('/profile',checkAuth,FrontController.profile);

// POST route for inserting student
route.post('/insertStudent', FrontController.insertStudent);
//Post route for update user profile
route.post('/updateProfile',checkAuth,FrontController.updateProfile);
route.post('/updatePassword',checkAuth,FrontController.updatePassword);

//POST route verify login
route.post('/verifyLogin',FrontController.verifyLogin);

//course routes
route.post('/courseInsert',checkAuth,CourseController.courseInsert);
route.get('/courseDisplay/',checkAuth,CourseController.courseDisplay);
route.get('/courseDelete/:id',checkAuth,CourseController.courseDelete);
route.get('/courseView/:id',checkAuth,CourseController.courseView);
route.get('/courseEdit/:id',checkAuth,CourseController.courseEdit);
route.post('/courseUpdate/:id',checkAuth,CourseController.courseUpdate);


//admin routes
route.get('/adminDisplay',checkAuth,adminAuth('admin'),AdminController.adminDisplay);
route.post('/updateStatus/:id',checkAuth,adminAuth('admin'),AdminController.updateStatus);

//contact message routes
route.post('/contactInsert',checkAuth,ContactController.contactInsert);
route.get('/contactMessage',checkAuth,ContactController.contactMessage);
route.get('/messageDelete/:id',checkAuth,ContactController.messageDelete);


//forgot password routes
route.post('/forgotPasswordVerify',FrontController.forgotPasswordVerify);
route.get('/resetPassword',FrontController.resetPassword);
route.post('/resetforgotPassword',FrontController.resetforgotPassword);

module.exports = route;

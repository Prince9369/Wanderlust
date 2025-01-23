const express=require("express");
const router=express.Router();
const User=require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync");
const passport=require('passport');
const {saveRedirectUrl}=require("../middleware");//we are requiring the saveRedirectUrl middleware from the middleware.js file

const userController=require('../controllers/users.js');

//router route for get and post signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//router.route for get and post login
router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:'/login',
    failureFlash:true
}),
userController.login
);

//logout route
router.get("/logout",userController.logout);

module.exports=router;
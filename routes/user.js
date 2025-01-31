const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const usersController = require("../controllers/user");


router
    .route("/signup")
    .get( usersController.renderSignupForm) //SignUp Route
    .post(wrapAsync(usersController.signUp) //Login route
);


router
    .route("/login")
    .get(usersController.renderLoginForm) //Login post route
    .post(saveRedirectUrl,
        passport.authenticate("local", 
        {failureRedirect : "/login",
        failureFlash : true}),
        wrapAsync(usersController.login)
);
    
//Logout route  

router.get("/logout", usersController.logout);

module.exports = router;
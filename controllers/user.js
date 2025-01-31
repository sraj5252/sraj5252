const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp =async (req,res)=>{
   try{
    let {username, email, password} = req.body;
    let newuser = new User({email, username});
    let registeredUser = await User.register(newuser, password);
    console.log(registeredUser);
    //Loginup directly after SignUp
    req.login(registeredUser ,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    });
   }
   catch(e){
    req.flash("error", e.message);  
    res.redirect("/signup");
   }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    // console.log(req.session.redirectUrl );
    // console.log(saveRedirectUrl.redirectUrl);
    res.redirect(req.session.redirectUrl || "/listings");
};

module.exports.logout =  (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
    });
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
};
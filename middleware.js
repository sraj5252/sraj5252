const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn=  (req,res, next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be Logged in first!");        
        return res.redirect("/login");
    }   
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req,res,next)=> {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not Owner of the Listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



module.exports.isReviewAuthor = async (req, res, next) => {
    console.log(req.params);
    const { id, reviewId } = req.params;
    console.log(reviewId);
    const review = await Review.findById(reviewId);
    
    // Check if review exists
    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }
    
    // Check if the current user is the owner of the review
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

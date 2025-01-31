const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});


//Controllers
const listingController = require("../controllers/listings.js");

// Validate Schema using middleware
let validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router
    .route("/") 
    .get(wrapAsync(listingController.index))  //Index route
    .post(isLoggedIn,                          // Create Route
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.create)
);


// New Route
router.get("/new", isLoggedIn , listingController.new);


router
    .route("/:id")
    .get(wrapAsync(listingController.show))  //Show Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.update)) //Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy));  //Delete Route

// Edit Route
router.get("/:id/edit",isLoggedIn ,isOwner ,wrapAsync(listingController.edit));

module.exports = router;
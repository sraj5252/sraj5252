const Listing = require("../models/listing");
const mapGeocoding = require('@mapbox/mapbox-sdk/services/geoCoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapGeocoding({ accessToken:mapToken});


// INDEX - show all listings
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

// NEW 
module.exports.new = (req, res) => {
    res.render("listings/new");
};

//SHOW 
module.exports.show =  async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate({
        path : "reviews",
        populate :{
            path : "author",
        },
    }).populate("owner");
    if(!listing){   //if listing is not when we delete it then found then flash an error
        req.flash("error" , "Listing not found.");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}

//CREATE

module.exports.create = async (req, res, next) => {

    //location coordinate access
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    newListing.image = {filename, url};

    newListing.geometry = response.body.features[0].geometry;  //Store from mapbox
    await newListing.save();
    req.flash("success" , "New Listing Created.");
    res.redirect("/listings");
}

//EDIT

module.exports.edit =  async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){   //if listing is not when we delete it then found then flash an error
        req.flash("error" , "Listing not found.");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit", { listing , originalImageUrl });
};

//UPDATE

module.exports.update = async (req, res, next) => {
    let { id } = req.params;   
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);

    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename; 
    listing.image = {filename,url};
    await listing.save();
    }

    req.flash("success" , "Listing Updated.");
    res.redirect(`/listings/${id}`);
}

//DELETE

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);  //this calls the post middleware in listing.js
    req.flash("success" , "Listing Deleted.");
    res.redirect("/listings");
}
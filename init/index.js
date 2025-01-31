const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing.js");


const MONGOO_URL = "mongodb://127.0.0.1:27017/wanderlust";   //We got the link from the mongoose website, and at last "Wanderlust is the Database".

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGOO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});

    //Add owner  
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner:"67978becd6d25ee6794eada2",
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was reinitialized");
};

initDB();
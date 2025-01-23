const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs"); 
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
      path:"reviews",//aisa krne se hr lisitng ke sath revie to aayega hi and uske sath author ka name bhi aayega ans isko hm nested populate bolte hai
      populate:{
      path:"author",//author ka id se author ka name nikalne k liye
      }
    })
    .populate("owner");//populate ka kam hai ki jab bhi ham koi listing find krte hai to uske reviews bhi find kr and owner bhi find kr
    //populate ka kam hai ki jab bhi ham koi listing find krte hai to uske reviews bhi find krte hai
    if(!listing){
          req.flash('error', 'Cannot find that listing!');//for flashing the message when we cannot find a listing
          return res.redirect("/listings");
      }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req, res, next) => {
  let response=await geocodingClient.forwardGeocode({//forwardGeocode ka matlab hai ki hum address ko lat and long me convert kr rhe hai
    query: req.body.listing.location,//yaha pe location me jo bhi address hoga wo aa jayega
    limit: 1,//limit 1 isliye diya hai ki agar koi bhi address match hota hai to uska first result hi chahiye
  })  
  .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;//isse ham owner ko save kr rhe hai and owner ka id req.user._id me hota hai
    newlisting.image = { url, filename };
    newlisting.geometry=response.body.features[0].geometry;//yaha pe lat and long save kr rhe hai
    let savedListing=await newlisting.save();
    // console.log(savedListing);
    req.flash('success', 'Successfully made a new listing!');//for flashing the message when we add a new listing
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash('error', 'Cannot find that listing!');//for flashing the message when we cannot find a listing
      return res.redirect("/listings");
  }
    let originalImageUrl=listing.image.url;
   originalImageUrl= originalImageUrl.replace("upload","upload/w_200,h_200,c_thumb");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
      let {id}=req.params;
      let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});//image file ke alawa baki saari details req.body me hoti hai to wo sari cheeje yaha se update ho jayengi 
      //for image update
      if(typeof req.file!=='undefined'){//if image is updated then only we will update the image
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();  
      }
      
      req.flash('success', 'Successfully updated a listing!');//for flashing the message when we update a listing
      res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a listing!');//for flashing the message when we delete a listing
    res.redirect("/listings");
};
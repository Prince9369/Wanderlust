const Listing = require('./models/listing');
const ExpressError=require('./utils/ExpressError.js')
const {listingSchema,reviewSchema}=require('./schema.js');
const Review=require('./models/review.js');



module.exports.isLoggedIn = (req, res, next) => {

    if(!req.isAuthenticated()){//req.isAuthenticated() is a method given by passport which checks if the user is signed in or not
        //redirect to original url if user is not logged in
        req.session.redirectUrl=req.originalUrl;//req.originalUrl is used to store the url where the user was before he was redirected to the login page and req.session.redirectUrl is used to redirect the user to the page where he was before he was redirected to the login page
        //agar user login nhi hai to uska original url store kr lenge in req.session.redirectUrl me and jab user login ho jayega to usko usi page pe redirect kr denge
        req.flash('error', 'You must be signed in');//for flashing the message when we are not signed in
       return res.redirect("/login");
    }
    next();
};

//problem with req.session.redirectUrl but in passport jaise hi hm login kr jaynge to req.session me redirectUrl ki key ki value remove ho jayegi
//to jab ham after login route req.seession.redirecturl ko  access krne ki koshish kr rhe honge to wo undefined return karega
//for that ham ek redirecturl ko res.locals me save kra lenge and passport locals ko delete nhi kr skti

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;//redirect url se locals me save kr lenge
    }
    next();
}


//to check the owner is doing cher char from the listings
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if( ! listing.owner._id.equals (req.user.id)){
        req.flash('error', 'You do not have permission to do that!');//for flashing the message the user do not have permission to update a listing
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//validatelisting ke liye ek middleware banayenge

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body); //validate the data using joi
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(","); //extract the error message and join from the error object
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};

//validateReview ke liye ek middleware banayenge
//REVIEW VALIDATION FROM SERVER SIDE

module.exports. validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body); //validate the data using joi
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(","); //extract the error message and join from the error object
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};

//to make sure the review can be deleted by the same user who created it
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if( ! review.author._id.equals (req.user.id)){
        req.flash('error', 'You are not the author of this review');//for flashing the message the user do not have permission to update a listing
        return res.redirect(`/listings/${id}`);
    }
    next();
};
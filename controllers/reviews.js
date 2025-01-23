const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req,res)=>{
    // console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;//new review ka author user ka id hoga

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash('success', 'Successfully made a new review!');//for flashing the message when we add a new review

    // console.log("new review saved");
    // res.send("new review saved");

    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//pull operator review array me se reviewid ko delete krne m help krega
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');//for flashing the message when we delete a review
    res.redirect(`/listings/${id}`);
};
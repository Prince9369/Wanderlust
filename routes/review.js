const express=require("express");
const router=express.Router({mergeParams:true});//mergeParams:true is used to pass the id from app.js to review.js
//or we can say parent route ex/lisitngs/id/reviews jo hr route k start m same hota hai usko pass child route ke sath pass krne k liye we use mergeParams:true
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const Review=require('../models/review.js');
const Listing=require('../models/listing.js');
const{validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');

const reviewController=require('../controllers/reviews.js');


//REVEIW ROUTES
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
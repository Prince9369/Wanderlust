const express=require("express");
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require('../models/listing.js');
const{isLoggedIn,isOwner,validateListing}=require('../middleware.js');
const multer  = require('multer')//for uploading files
//cloudinary configuration
const {storage}=require('../cloudConfig.js');
// const cloudinary = require('cloudinary').v2;

//multer configuration
const upload = multer({storage});//ab files cloudinary me store hogi 

const listingController=require('../controllers/listings.js');

//ROUTER ROUTE for get index and post create listing
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
//upload.single('listing[image]') is used to upload a single file and 'listing[image]' is the name of the file input field in the form


  //TOPIC=>NEW ROUTE
  router.get("/new",isLoggedIn,listingController.renderNewForm);

//router route for shoe,update and delete listing
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
  
  //TOPIC=>EDIT ROUTE
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

  module.exports=router;
  

  
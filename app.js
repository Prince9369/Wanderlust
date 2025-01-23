
if(process.env.NODE_ENV!=="production"){
//process.env.NODE_ENV is an environment variable that is set to "production" by default when the app is deployed to a server. When the app is running on your local machine, it is not set to "production". So, we can use this to check if the app is running on your local machine or on a server. If it is running on your local machine, we can use the dotenv package to read the .env file and set the environment variables. If it is running on a server, we don't need to use the dotenv package because the environment variables are already set on the server.
//process.env.NODE.ENV!=="production" means that if the app is not running on a server, then use the dotenv package to read the .env file and set the environment variables
    require('dotenv').config();
}
require('dotenv').config() // this will read the .env file and set the environment variables
console.log(process.env.SECRET) // process.env is an object that contains all the environment variables

//LECTURE 1=> BASIC SETUP
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
//MONODB ATLAS CONNECTION STRING
const dbUrl=process.env.ATLASDB_URL;

const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');//MongoStore is used to store the session in the database
const flash=require('connect-flash');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user.js');

const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');

main().then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

//mongoose session store
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,//secret ka kam hota hai ki session ko encrypt krna
    },
    touchAfter:24*60*60//touchAfter ka kam hota hai ki session ko kitne time ke baad update krna hai it is in seconds
});

//niche wala code session store ke error ko handle krne ke liye hai
store.on("error",()=>{
    console.log("Error in MONGo SESSION STORE",err);
});

//SESSION CONFIG
const sessionOptions={
    store,
    secret:process.env.SECRET,//secret ka kam hota hai ki session ko encrypt krna
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,//httpOnly true means cookie is not accessible through client side javascript
        expires:Date.now()+1000*60*60*24*7,//time is in milliseconds in this exmaple it is 7 days
        maxAge:1000*60*60*24*7//maxage is in milliseconds
    }
};

//ROOT ROUTE
// app.get('/',(req,res)=>{
//     res.send("Hi ,I am root route");
// });



app.use(session(sessionOptions));
app.use(flash());

//ham passport hmesha session ke baad use krte hai kyonki passport session ke help se user ko track krta hai ki wo kaun hai and passport session ke help se user ko login krne me help krta hai and passport session ke help se user ko logout krne me help krta hai
app.use(passport.initialize());//passport.initialize() kA kam hota hai ki passport ko initialize krna and passport ko session ke help se user ko track krne me help krta hai and passport ko session ke help se user ko login krne me help krta hai and passport ko session ke help se user ko logout krne me help krta hai
app.use(passport.session());//passport .session() kA kam hota hai ki passport ko session ke help se user ko track krne me help krta hai and passport ko session ke help se user ko login krne me help krta hai and passport ko session ke help se user ko logout krne me help krta hai
passport.use(new localStrategy(User.authenticate()));//localstrategy is used to authenticate the user and User.authenticate() is a method provided by passport-local-mongoose to authenticate the user and it will also add some methods to our schema like as authenticate,setpassword,updatepassword etc

passport.serializeUser(User.serializeUser());//serializeUser is used to store the user in the session and it is provided by passport-local-mongoose to store the user in the session 
passport.deserializeUser(User.deserializeUser());//deserializeUser is used to remove the user from the session and it is provided by passport-local-mongoose to remove the user from the session

//MIDLEWARE FOR FLASH MESSAGES
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;//req.user is a method given by passport which checks if the user is signed in or not
    //res.locals is used to make the variable available in all the templates and bina iske hm req.user ko template me pass nhi kr skte
    next();
}
);

//DEMO USER FOR TESTING PURPOSE OF AUTHENTICATION
// app.get("/demo",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:" delta student"//hamne user schemna me sirf email rkhi hai username nhi to ham yaha fake user me username add kr skte hai wrna passportlocalmongoose automatically add krega
//     });

//     let registeredUSer=await User.register(fakeUser,"helloWorld");//register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. 
//     res.send(registeredUSer);
// }
// );





//for all listings related routes
app.use("/listings",listingRouter);
//for all reviews related routes
app.use("/listings/:id/reviews",reviewRouter);
//yaha se jo id aa rhi hai wo sirf app.js tk hi aa rhi hai baki routes tk nhi aa rhi and use hame review.js me pass krane ke liye we use mergeParams:true in router

//for all user related routes
app.use("/",userRouter);


//Page not found error handler for not specified routes
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found!"));
// });

//CUSTOM ERROR HANDLER
app.use((err,req,res,next)=>{
    // console.log(err);
    let{statusCode=500,message="Something Went Wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{statusCode,message});
});
app.listen(8080,()=>{
    console.log('Server is running on port 8080');
});
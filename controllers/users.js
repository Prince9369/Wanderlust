const User = require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUSer=new User({email,username});
        const registeredUser=await User.register(newUSer,password);
        //User.register k use se ham password ko hash krte hai and user ko save krte hai and user ko login krte hai and user ko logout krte hai and user ko authenticate krte hai and user ko serialize krte hai and user ko deserialize krte hai and user ko session me store krte hai and user ko session se remove krte hai 
        // console.log(registeredUser);
        //ham chahte hai ki jab user register ho to wo login ho jaye for that we are using req.login method given by passport 
        req.login(registeredUser,(err)=>{//req.login is a method given by passport which is used to login the user and it takes a user as an argument and a callback function as an argument which takes an error as an argument and if there is an error then it will be passed to the error handling middleware and if there is no error then it will redirect to the home page
            if(err){
                return next(err);
            }
            req.flash('success', 'Successfully registered!');//for flashing the message when we add a new listing
            res.redirect("/listings");
        }
        );
       
    } catch(e){
        req.flash('error', e.message);//for flashing the message when we cannot find a listing
        res.redirect("/signup");
    }

    //try catch is liye use kiya hai taki agar koi error aaye to ham us error ko flash kr ske and usi page pe rhe ske instead of redirecting to error page

};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    //passport.authenticate() is a middleware provided by passport to authenticate the user and isme do cheeje hoti hai ek strategy and failureRedirect ji batata hai ki agar user authenticate nhi hota to kaha redirect krna hai and successRedirect ji batata hai ki agar user authenticate hota hai to kaha redirect krna hai
    //failureFlash:true is used to flash the message when user is not authenticated

    req.flash('success', 'Welcome back! To WanderLust');//for flashing the message when we add a new listing
    res.redirect(res.locals.redirectUrl || "/listings");//agar redirectUrl nhi hai to /listings pe redirect kro
};

module.exports.logout=(req,res,next)=>{
    req.logout((err) => {//req.logout() is a method given by passport which is used to logout the user and it takes a callback function as an argument which takes an error as an argument and if there is an error then it will be passed to the error handling middleware and if there is no error then it will redirect to the home page
        if(err){
           return next(err);//return keyword is used to stop the execution of the code and return next(err) is used to pass the error to the error handling middleware
        }
        req.flash('success', 'you are logged out!');//
        res.redirect("/listings");
    });
};
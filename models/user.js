const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);//passport-local-mongoose is used to add some methods to our schema like as authenticate,setpassword,updatepassword etc and it will also add username and password field to our schema 

const User = mongoose.model('User', UserSchema);
module.exports = User;
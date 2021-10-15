const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type:String,
        required:[true,'Username cant be empty']
    },
    email: {
        type:String,
        required:[true,'Username cant be empty']
    },

})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema);
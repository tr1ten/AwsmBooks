const mongoose = require('mongoose');
const User = require('./user')
const Schema = mongoose.Schema;
const ReviewSchema = new Schema({
    by:{
        type:Schema.Types.ObjectId,
        ref:User,
    },
    ratings: {
        type:Number,
        required:true,
    },
    comment: String,
},
    {
        timestamps: true,
    })

module.exports = mongoose.model('Review', ReviewSchema);
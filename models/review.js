const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReviewSchema = new Schema({
    userId: String,
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
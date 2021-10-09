const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    tag:String,
    title:String,
    price:Number,
    rating:Number,
    description:String,
    imageurl:String,

})

module.exports = mongoose.model('Item',ItemSchema);
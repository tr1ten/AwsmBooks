const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    tag: String,
    title: String,
    price: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: Review,
        }
    ],
    description: String,
    imageurl: String,

})
ItemSchema.post('findOneAndDelete',async (item) => {
    console.log('deleteing middleware for ', item)
    await Review.deleteMany({
        _id: {
            $in: item.reviews,
        }
    });
})
module.exports = mongoose.model('Item', ItemSchema);
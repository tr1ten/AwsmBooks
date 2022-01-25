const mongoose = require('mongoose');
const Item = require('./item')
const User = require('./user')
const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,

    },
    itemId: 
        {
            type: Schema.Types.ObjectId,
            ref: Item,
        }

})

module.exports = mongoose.model('Subscription', SubscriptionSchema);
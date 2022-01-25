const mongoose = require('mongoose');
const User = require('./user')
const NotificationSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:User,
    },
    isSeen: {
        type:Boolean,
        required:true,
    },
    label: String,
    redirectUrl: String,
},
    {
        timestamps: true,
    })

module.exports = mongoose.model('Notification', NotificationSchema);
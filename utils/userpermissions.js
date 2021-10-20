const passport = require('passport')
const Item = require('../models/item')
module.exports = async (req,res,next) =>{
    
    const {id} = req.params;
    const item = await Item.findById(id).populate('author');
    console.log(`user permission req by ${req.user} for ${item.author._id} `);
    
    if(item.author._id!=req.user.id){
        req.flash('error','not permitted')
        res.redirect('/')
        
    }
    else{
    next()
    }
}
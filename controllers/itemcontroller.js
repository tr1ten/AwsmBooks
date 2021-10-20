const Item = require('../models/item')
const Review = require('../models/review')
module.exports.deleteItem = (req, res) => {

    const { id } = req.params;
    console.log('delete req ->', req.body, id)
    Item.findByIdAndDelete(id, { ...req.body }, () => {
        req.flash('info', 'Book deleted!')
        res.redirect('/shop')
    })

}
module.exports.editItem =  (req, res) => {

    const { id } = req.params;
    console.log('put req ->', req.body, id)
    Item.findByIdAndUpdate(id, { ...req.body }, () => {
        res.redirect('/shop')
    })

}
module.exports.getItem = async (req, res) => {
    const { id } = req.params
    const item = await Item.findById(id);
    const reviews = []
    for (let rid of item.reviews) {
        review = await Review.findById(rid).populate('by')
        reviews.push(review)
    }
    console.log('review the item', item, reviews)
    res.render('pages/show', { item, reviews });
}
module.exports.addItem = (req, res)=>{
    console.log('post req ->', req.body)
    const item = new Item({ ...req.body ,author:req.user.id})
    item.save((err, docs) => {
        console.log('item added')
    })
    // flashing the message to req 
    req.flash('info', 'Book added!')
    res.redirect('/shop')
}
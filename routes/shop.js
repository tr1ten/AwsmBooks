const validate = require('../utils/validate')
const Review = require('../models/review')
const Item = require('../models/item')
const AsyncWrap = require('../utils/asyncwrap')
const express = require('express')
const uservalidate = require('../utils/uservalidate')
router = express.Router()
router.get('/add', uservalidate,(req, res) => {
    res.render('pages/additem');
})

router.get('/edit/:id', uservalidate,AsyncWrap(async (req, res) => {
    const { id } = req.params
    item = await Item.findById(id);
    res.render('pages/edit', item);
}))
router.get('/:id', AsyncWrap(async (req, res) => {
    const { id } = req.params
    const item = await Item.findById(id);
    const reviews = []
    for (let rid of item.reviews) {
        review = await Review.findById(rid)
        reviews.push(review)
    }
    console.log('review the item', item, reviews)
    res.render('pages/show', { item, reviews });
}))

router.get('/', AsyncWrap(async (req, res) => {
    const items = await Item.find({})
    res.render('pages/shop', { items })

}))

// Post request 

router.use(express.urlencoded({ extended: true }))
router.post('/', uservalidate,validate, function (req, res) {
    console.log('post req ->', req.body)
    const item = new Item({ ...req.body })
    item.save((err, docs) => {
        console.log('item added')
    })
    // flashing the message to req 
    req.flash('info', 'Book added!')
    res.redirect('/shop')
})
router.post('/:id/reviews', AsyncWrap(async function (req, res) {
    console.log('post review req ->', req.body)
    const { id } = req.params
    req.body.userId = 'Shubh'; //Adding default to-do change to signed user 
    const review = new Review({ ...req.body })
    const item = await Item.findById(id)
    await review.save(async (err, docs) => {


        if (err) {
            throw new HttpError('Please enter valid data', 400)
        }
        else {
            item.reviews.push(review)
            await item.save()

            console.log('review added to ', review, item.title)
        }

    })
    res.redirect('/shop/' + id)




}))

// Misc Http 

router.put('/:id', validate, (req, res) => {

    const { id } = req.params;
    console.log('put req ->', req.body, id)
    Item.findByIdAndUpdate(id, { ...req.body }, () => {
        res.redirect('/shop')
    })

})
router.delete('/:id', uservalidate,(req, res) => {

    const { id } = req.params;
    console.log('delete req ->', req.body, id)
    Item.findByIdAndDelete(id, { ...req.body }, () => {
        req.flash('info', 'Book deleted!')
        res.redirect('/shop')
    })

})
router.delete('/:id/reviews/:rid', uservalidate,(req, res) => {

    const { id, rid } = req.params;
    console.log('delete req ->', rid, id)
    Review.findByIdAndDelete(rid, { ...req.body }, async () => {
        const item = await Item.findById(id)
        item.reviews = item.reviews.filter((idd) => idd != rid)
        await item.save()
        req.flash('info', 'review deleted!')
        res.redirect('/shop/' + id)
    })

})

module.exports = router;
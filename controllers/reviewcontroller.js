const Review = require('../models/review')
const Item = require('../models/item')

module.exports.addReview = async function (req, res) {
    console.log('post review req ->', req.body)
    const { id } = req.params
    req.body.by = req.user.id;
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




}
module.exports.deleteReview = async (req, res) => {

    const { id, rid } = req.params;
    const review = await Review.findById(rid);
    console.log(`delete review req by ${req.user} for ${review.by}`);
    if (review.by != req.user.id) {
        req.flash('error','u dont have enough perms')
        res.redirect('/')
    }
    else {
        console.log('delete req ->', rid, id)
        Review.findByIdAndDelete(rid, { ...req.body }, async () => {
            const item = await Item.findById(id)
            item.reviews = item.reviews.filter((idd) => idd != rid)
            await item.save()
            req.flash('info', 'review deleted!')
            res.redirect('/shop/' + id)
        })
    }

}
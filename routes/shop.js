const validate = require('../utils/validate')
const Item = require('../models/item')
const Subscription = require('../models/subscription')
const AsyncWrap = require('../utils/asyncwrap')
const express = require('express')
const uservalidate = require('../utils/uservalidate')
const isuserpermit = require('../utils/userpermissions')
const { addItem, deleteItem, editItem, getItem } = require('../controllers/itemcontroller')
const {addReview,deleteReview} = require('../controllers/reviewcontroller')
const {subscribeTo,unSubscribeTo} = require('../controllers/subscriptioncontroller');
router = express.Router()
//Home page
router.get('/', AsyncWrap(async (req, res) => {
    const items = await Item.find({})
    if(!req?.user?.id)
    {
        res.render('pages/shop', { items })
    }
    else{
        const newItems = [];
        const allSubscription = await  Subscription.find({userId:req.user.id});

        for(let item of items )
        {
            item = JSON.parse(JSON.stringify(item));
            item.haveSub = false;
            item.author = {
                _id:item.author
            }
            for (let subscription of allSubscription) {
                if(subscription.itemId.equals(item._id))
                {
                    item.haveSub=true;
                    break;
                }
            }
            newItems.push(item);

        }
        res.render('pages/shop', { items:newItems })
    }

}))
// add screen 
router.get('/add', uservalidate, (req, res) => {
    res.render('pages/additem');
})
// crud for item
router.route('/:id')
    .get(AsyncWrap(getItem))
    .delete(uservalidate, isuserpermit, deleteItem)
    .put(validate, isuserpermit, editItem)


router.get('/edit/:id', uservalidate, AsyncWrap(async (req, res) => {
    let { id } = req.params;
    let item = await Item.findById(id);
    res.render('pages/edit', {item});
}))



// Post request 

router.use(express.urlencoded({ extended: true }))
router.post('/', uservalidate, validate, addItem)
router.post('/:id/reviews', uservalidate,AsyncWrap(addReview))
router.post('/:id/subscribe',uservalidate,subscribeTo);
router.post('/:id/unsubscribe',uservalidate,unSubscribeTo);

// Misc Http 


router.delete('/:id/reviews/:rid', uservalidate, deleteReview)

module.exports = router;
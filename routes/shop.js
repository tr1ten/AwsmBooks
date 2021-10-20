const validate = require('../utils/validate')
const Item = require('../models/item')
const AsyncWrap = require('../utils/asyncwrap')
const express = require('express')
const uservalidate = require('../utils/uservalidate')
const isuserpermit = require('../utils/userpermissions')
const { addItem, deleteItem, editItem, getItem } = require('../controllers/itemcontroller')
const {addReview,deleteReview} = require('../controllers/reviewcontroller')
router = express.Router()
//Home page
router.get('/', AsyncWrap(async (req, res) => {
    const items = await Item.find({})
    res.render('pages/shop', { items })

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
    const { id } = req.params
    item = await Item.findById(id);
    res.render('pages/edit', item);
}))



// Post request 

router.use(express.urlencoded({ extended: true }))
router.post('/', uservalidate, validate, addItem)
router.post('/:id/reviews', uservalidate,AsyncWrap(addReview))

// Misc Http 


router.delete('/:id/reviews/:rid', uservalidate, deleteReview)

module.exports = router;
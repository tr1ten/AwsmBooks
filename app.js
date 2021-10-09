const express = require('express')
const path = require('path')
const Item = require('./models/item')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
 


mongoose.connect('mongodb://localhost:27017/BooksStore').then(() => {
    console.log('Succesfully connected to Db!')
}).catch(() => {
    console.log('error occured!')
})
// Setting up express server
const app = express()
// override with the _method in the query
app.use(methodOverride('_method'))
const port = 3000


app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

// Routing  -->
// Get request
app.get('/shop/add', (req, res) => {
    res.render('pages/additem');
})
app.get('/shop/edit/:id', async (req, res) => {
    const {id} = req.params
    item =await Item.findById(id);
    res.render('pages/edit',item);
})
app
app.get('/shop', async (req, res) => {
    const items = await Item.find({})
    res.render('pages/shop', { items })

})
app.get('/', (req, res) => {
    res.render('index')
})
// Post request 

app.use(express.urlencoded({extended:true}))
app.post('/shop', function (req, res) {
    console.log('post req ->',req.body)
    const item = new Item({...req.body})
    item.save((err,docs)=>{
        console.log('item added')
    })

    res.redirect('/shop')
})
// Misc Http 

app.put('/shop/:id',(req,res)=>{
    
    const {id} = req.params;
    console.log('put req ->',req.body,id)
    Item.findByIdAndUpdate(id,{...req.body},()=>{
        res.redirect('/shop')
    })
    
})
app.delete('/shop/:id',(req,res)=>{
    
    const {id} = req.params;
    console.log('delete req ->',req.body,id)
    Item.findByIdAndRemove(id,{...req.body},()=>{
        res.redirect('/shop')
    })
    
})
app.listen(port, () => console.log(`Example app listening on port ${port}`))
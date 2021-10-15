const Item = require('../models/item')
const Review = require('../models/review')

const mongoose = require('mongoose')

const cleanUp = async () => { 
    await Item.deleteMany({}) 
    await Review.deleteMany({})
};


const arr = [
    {
        title: 'Mathemcatics for linear Aljebra',
        imageurl: 'https://images-na.ssl-images-amazon.com/images/I/71wVt05P30L.jpg',
        tag: "Linear Aljebra",
        price: 69,
        description: 'Hello world book',

    },
    {
        title: 'Mathemcatics for linear Aljebra',
        imageurl: 'https://images-na.ssl-images-amazon.com/images/I/71wVt05P30L.jpg',
        tag: 'Linear Aljebra',
        price: 70,
        description: 'Hello world book',

    }

];

mongoose.connect('mongodb://localhost:27017/BooksStore').then(async () => {
    console.log('Succesfully connected to Db!')
    await cleanUp()


    Item.insertMany(arr, function (error, docs) {
        if (error) {
            console.log('error while seeding!! ', error)
        }
        else {
            console.log('successfully seeded')
            mongoose.connection.close()
        }

    });


}).catch((e) => {
    console.log('error occured!', e)
})

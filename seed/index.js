const Item = require('../models/item')
const mongoose = require('mongoose')
const cleanUp = async () => await Item.deleteMany({});


const arr = [
    {
        title: 'Mathemcatics for linear Aljebra',
        imageurl: 'https://images-na.ssl-images-amazon.com/images/I/71wVt05P30L.jpg',
        tag: "Linear Aljebra",
        price: 69,
        rating: 10,
        description:'Hello world book',

    },
    {
        title: 'Mathemcatics for linear Aljebra',
        imageurl: 'https://images-na.ssl-images-amazon.com/images/I/71wVt05P30L.jpg',
        tag: 'Linear Aljebra',
        price: 70,
        rating: 10,

        description:'Hello world book',

    }

];

mongoose.connect('mongodb://localhost:27017/BooksStore').then(async () => {
    console.log('Succesfully connected to Db!')
    cleanUp()


    Item.insertMany(arr, function (error, docs) {
        if (error) {
            console.log('error while seeding!! ', error)
        }
        else {
            console.log('successfully seeded')
            mongoose.connection.close()
        }

    });


}).catch(() => {
    console.log('error occured!')
})

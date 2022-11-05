const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yelmouss:Mos1969@yelmousscluster.rxp3jsa.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



app.use('/api/sauces', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        userId : "String",
        name : "String",
        manufacturer : "String",
        description : "String",
        mainPepper : "String",
        imageUrl : "String",
        heat : "1",
        likes :" 1",
        dislikes :"1",
        usersLiked : "array",
        usersDisliked : "array",
      },
      {
        _id: 'oeihfzeomoihi',
        userId : "String",
        name : "String",
        manufacturer : "String",
        description : "String",
        mainPepper : "String",
        imageUrl : "String",
        heat : "1",
        likes :" 1",
        dislikes :"1",
        usersLiked : "array",
        usersDisliked : "array",
      },
    ];
    res.status(200).json(stuff);
  });


module.exports = app;
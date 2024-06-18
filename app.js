require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require('cookie-session');


const homeRoute = require('./routes/home');
const selectedRoute = require('./routes/selected');
const booksRoute = require('./routes/books');
const loginRoute = require('./routes/login');
const adminRoute = require('./routes/admin');


const MongoDB = require('./utils/connectMongoDB');

const app = express(); 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));
app.use("/uploads",express.static('uploads'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

MongoDB();


//END POINTS
app.use('/',homeRoute);
app.use('/audios',selectedRoute);
app.use('/books',booksRoute);
app.use('/login',loginRoute);
app.use('/admin',adminRoute);
app.get('/logout',(req,res)=>{
    req.session.user = null;
    res.redirect('/login');
});

app.listen(process.env.PORT ||3000,()=>{
    console.log("Music Website Is Running On Port 3000");
});
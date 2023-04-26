//
// rewuired modules 
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const ejs = require('ejs');
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const router = require("./routes/router.js");

const userrouter = require("./routes/userrouter.js");   

 
// create app 
const app = express();
// configure app
let port = 3000;
let host = 'localhost';
// setting the view engine
app.set('view engine','ejs');
// mount middlware 

//connecting to MongoDB database
mongoose.connect('mongodb://127.0.0.1/trades', {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    //starting the server
    app.listen(port, host, () => {
        console.log("Server is running on port :: " + port);
    })
})
.catch(err=>console.log(err));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));// allow to pass date in request body which helps to deal with post request
app.use(morgan('tiny'));// helps to log all the request
app.use(methodOverride('_method'));
// set up routes 
//app.use('/', mainRoutes); // home page, sign in and sign up

// Sessions
app.use(session({
    secret: "89df98q2389",      // TODO: Can't remember where this came from
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({
        mongoUrl: "mongodb://127.0.0.1/demos"       // TODO: Maybe change "demos"
    })
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash("success");
    res.locals.errorMessages = req.flash("error");
    next();
});


app.use('/', router); 
app.use("/users", userrouter);


app.use((req, res, next) => {
    let err = new Error("The server cannot find " + req.url);
    err.status = 404;
    next(err);
});
// start the server 

app.use((err, req, res, next)=> {
    console.log(err.stack);
    if (!err.status){
        err.status = 500;
        err.message=("Internal server error");
    }
    res.status(err.status);
    res.render('error', {error:err});
});



  
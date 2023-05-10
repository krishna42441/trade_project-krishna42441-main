const model = require('../models/data.js');
const user_model = require("../models/user.js");

// GET /
// Returns the homepage
exports.index = (req, res) => {
    res.render('index', { root: __dirname });
};

// GET /newConnection
// Returns the new connection form
exports.new = (req, res) => {
    res.render('newTrade', {});
};

// Makes a new trade
exports.make = (req, res) => {
    let user_id = req.session.user;
    let trade_id = req.params.tid;
    
    user_model.find()
        .then(users => {
            var all_users = [];
            users.forEach(user => {
                if (user.id != user_id) {
                    all_users.push(user);
                }
            });
            res.render("makeTrade", {users: all_users, trade_id: trade_id});
        })
        .catch(err => {console.log(err); next(err)});
};

// POST /newConnections
// Called when we create a new story
exports.postNew = (req, res) => {
    let user_id = req.session.user;
    let trade = new model(req.body);
    trade.user_id = user_id;
    trade.save()
        .then(trade => res.redirect("/trades"))
        .catch(err => {
            if (err.name === "ValidationError") {
                err.status = 400;
            }
            next(err);
        });
};

// GET /about
// Returns the about page
exports.about = (req, res) => {
    res.render('about', {});
};

// GET /contact
// Returns the contact page
exports.contact = (req, res) => {
    res.render('contact', {});
};

// GET /trades
// Returns a categorized list of all available connections
exports.trades = (req, res) => {
    model.find()
        .then(trades => {
            var mobiles = [];
            var accessories = [];
            trades.forEach(item => {
                if (item.topic === "mobiles")
                    mobiles.push(item);
                else if (item.topic === "accessories") 
                accessories.push(item);
            });
            res.render('trades', {mobiles: mobiles, accessories: accessories});
        })
        .catch(err => next(err));
};

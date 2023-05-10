const model = require("../models/user.js");
const trade_model = require("../models/data.js");
const send_model = require("../models/send.js");
const watch_model = require("../models/watch.js");

exports.new = (req, res) => {
    res.render("./users/new");
};

exports.create = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const existingUser = await model.findOne({ email: email });
        
        if (existingUser) {
            req.flash("error", "This email is already associated with an account.");
            return res.redirect("/users/new");
        }
        
        const newUser = new model(req.body);
        await newUser.save();
        
        req.flash("success", "The user was successfully created.");
        req.session.user = newUser._id;
        res.redirect("/trades");
    } catch (err) {
        if (password.length < 6) {
            req.flash("error", "Password must be at least six characters long.");
            return res.redirect("/users/new");
        }
        
        if (err.name === "ValidationError") {
            req.flash("error", err.message);
            return res.redirect("/users/new");
        }
        
        if (err.code === 11000) {
            req.flash("error", "This email is already associated with an account.");
            return res.redirect("/users/new");
        }
        
        next(err);
    }
};


exports.showLogin = (req, res) => {
    res.render("./users/login");
};

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await model.findOne({ email: email });
        
        if (user) {
            const result = await user.comparePassword(password);
            
            if (result) {
                req.session.user = user._id;
                req.flash("success", "You have successfully logged in.");
                res.redirect("/users/profile");
            } else {
                req.flash("error", "Wrong password!");
                res.redirect("/users/login");
            }
        } else {
            req.flash("error", "Unknown user!");
            res.redirect("/users/login");
        }
    } catch (err) {
        next(err);
    }
};

exports.profile = async (req, res, next) => {
    try {
        const id = req.session.user;
        const user = await model.findById(id);

        if (user) {
            const trades = await trade_model.find();
            let user_trades = [];
            let all_trades = [];
            trades.forEach(trade => {
                if (trade.user_id == id)
                    user_trades.push(trade);
                all_trades.push(trade);
            });

            const sends = await send_model.find();
            const watches = await watch_model.find();

            res.render("./users/profile", {
                user: user,
                trades: user_trades,
                all_trades: all_trades,
                sends: sends,
                watches: watches
            });
        } else {
            console.log("Unknown user.");
            res.redirect("/users/login");
        }
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        else res.redirect("/");
    });
};


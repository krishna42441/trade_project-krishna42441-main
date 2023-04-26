const model = require("../models/user.js");
const trade_model = require("../models/data.js");

exports.new = (req, res) => {
    res.render("./users/new");
};

exports.create = (req, res, next) => {
    let user = new model(req.body);
    let email = req.body.email;
    let password = req.body.password;
    
    model.findOne({email: email})
        .then(usr => {
            if (usr) {
                req.flash("error", "This email is already associated with an account.");
                return res.redirect("/users/new");
            }
            user.save()
                .then(user => {
                    req.flash("success", "The user was successfully created.");
                    req.session.user = user._id;
                    res.redirect("/trades")
                })
                .catch(err => {
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
                });
        })
        .catch(err => next(err));
        
    
};

exports.showLogin = (req, res) => {
    res.render("./users/login");
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    
    model.findOne({email: email})
        .then(user => {
            if (user) {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.flash("success", "You have successfully logged in.");
                            res.redirect("/users/profile");
                        } else {
                            req.flash("error", "Wrong password!");
                            res.redirect("/users/login");
                        }
                    })
                    .catch(err => {
                        console.log("Unable to compare passwords.");
                        console.log(err);
                        res.redirect("/users/login");
                    });
            } else {
                req.flash("error", "Unknown user!");
                res.redirect("/users/login");
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    model.findById(id)
        .then(user => {
            if (user) {
                trade_model.find()
                    .then(trades => {
                        let user_trades = [];
                        trades.forEach(trade => {
                            if (trade.user_id == id)
                                user_trades.push(trade);
                        });
                    
                        res.render("./users/profile", {user: user, trades: user_trades});
                    })
                    .catch(err => next(err));
            } else {
                console.log("Unknown user.");
                res.redirect("/users/login");
            }
        })
        .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        else res.redirect("/");
    });
};

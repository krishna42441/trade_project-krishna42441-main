const model = require('../models/data.js');
const send_model = require("../models/send.js");
const watch_model = require("../models/watch.js");

// GET /connection/:sid
// Returns data about a specific connection
exports.showConnection = async (req, res, next) => {
    try {
        const id = req.params.sid;
        const user_id = req.session.user;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            let err = new Error("Cannot find trade with id: " + id);
            err.status = 404;
            throw err;
        }

        const trade = await model.findById(id);
        const watches = await watch_model.find();

        if (trade) {
            const is_owner = trade.user_id == user_id;
            let is_watch = false;
            watches.forEach(watch => {
                if (watch.user_id == user_id && watch.trade_id == trade.id) {
                    is_watch = true;
                }
            });
            
            res.render("trade", { trade, is_owner, is_watch, user_id });
        } else {
            let err = new Error("Cannot find a trade with id: " + id);
            err.status = 404;
            throw err;
        }
    } catch (err) {
        next(err);
    }
};

//
// Setup:
// user -> Giving item
// Receivier -> getting item
// UID -> Receiver
// TID -> Receiver_trade
//
exports.make = (req, res, next) => {
    let user_id = req.session.user;
    let trade_id = req.params.tid;
    let src_user_id = req.params.uid;
    
    model.find()
        .then(trades => {
            console.log(trades);
            console.log(user_id);
            console.log(trade_id);
            console.log(req.params.uid);
            res.render('makeTrade2',
                {
                    trades: trades,
                    user_id: user_id,
                    receiver_trade_id: trade_id,
                    receiver_id: req.params.uid
                }
            );
        })
        .catch(err => next(err));
}; 

exports.submitTrade = (req, res, next) => {
    let send = new send_model(req.body);
    send.save()
        .then(trade => res.redirect("/users/profile"))
        .catch(err => {
            if (err.name === "ValidationError") {
                err.status = 400;
            }
            next(err);
        });
};

exports.acceptTrade = async (req, res, next) => {
    try {
        const { user_id, user_trade_id, receiver_id, receiver_trade_id, send_id } = req.body;

        await model.findByIdAndUpdate(receiver_trade_id, { user_id });
        await model.findByIdAndUpdate(user_trade_id, { user_id: receiver_id });
        const send = await send_model.findByIdAndDelete(send_id, { useFindAndModify: false });

        if (send) {
            res.redirect('/users/profile');
        } else {
            let err = new Error('Cannot find a send request with id ' + send_id);
            err.status = 404;
            throw err;
        }
    } catch (err) {
        next(err);
    }
};


exports.refuseTrade = (req, res, next) => {
    let data = req.body;
    send_model.findByIdAndDelete(data.send_id, {useFindAndModify: false})
        .then(send => {
            if (send) {
                res.redirect('/users/profile');
            } else {
                let err = new Error('Cannot find a send request with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// GET /connection/:sid/edit
// Create an HTML form for editing a connection
exports.edit = (req, res, next) => {
    let id = req.params.sid;
    let user_id = req.session.user;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Cannot find connection with trade: " + trade);
        err.status = 404;
        return next(err);
    }
    
    model.findById(id)
        .then(trade => {
            if (trade) {
                if (user_id != trade.user_id) {
                    let err = new Error("Unable to edit: Invalid user.");
                    err.status = 401;
                    next(err);
                }
                return res.render("edit", {trade: trade});
            } else {
                let err = new Error("Cannot find a trade with id: " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// Saves an item to the watch list
exports.saveWatch = (req, res, next) => {
    let id = req.params.sid;
    let data = new watch_model(req.body);
    data.trade_id = id;
    data.user_id = req.session.user;
    data.save()
        .then(w => res.redirect("/trade/" + id))
        .catch(err => {
            if (err.name === "ValidationError") {
                err.status = 400;
            }
            next(err);
        });
};

// Removes an item from the user's watch list
exports.removeWatch = (req, res, next) => {
    let id = req.params.sid;
    watch_model.findByIdAndDelete(id, {useFindAndModify: false})
        .then(watch => {
            if (watch) {
                res.redirect('/users/profile');
            } else {
                let err = new Error('Cannot find a watched item with id ' + id);
                err.status = 404;

                next(err);
            }
        })
        .catch(err => next(err));
};

// POST /connection/:sid/edit
// Saves data from editing a connection
exports.saveEdit = (req, res, next) => {
    let id = req.params.sid;
    let data = req.body;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Cannot find a trade with id ' + id);
        err.status = 404;
        return next(err);
    }
    
    model.findByIdAndUpdate(id, data, {useFindAndModify: false, runValidators: true})
        .then(trade => {
            if (trade) {
                res.redirect('/trade/' + id);
            } else {
                let err = new Error('Cannot find a trade with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === "ValidationError") {
                err.status = 400;
            }
            next(err);
        });
};

// DELETE /connection/:sid
// Deletes a given connection
exports.delete = (req, res, next) => {
    let id = req.params.sid;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Cannot find a trade with id ' + id);
        err.status = 404;
        return next(err);
    }
    
    model.findByIdAndDelete(id, {useFindAndModify: false})
        .then(trade => {
            if (trade) {
                res.redirect('/trades');
            } else {
                let err = new Error('Cannot find a connection with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};
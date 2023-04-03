const model = require('../models/data.js');

exports.index = (req, res) => {
    res.render('index', { root: __dirname });
};

exports.new = (req, res) => {
    res.render('newTrade', {});
};

exports.postNew = (req, res ,next) => {
    let trade = new model(req.body);
    trade.save()
        .then(trade => res.redirect("/trades"))
        .catch(err => {
            if (err.name === "ValidationError") {
                err.status = 400;
            }
            next(err);
        });
};

exports.about = (req, res) => {
    res.render('about', {});
};

exports.contact = (req, res) => {
    res.render('contact', {});
};

exports.trades = (req, res) => {
    model.find()
        .then(trades => {
            var mobiles = [];
            var accessories = [];
            trades.forEach(trade => {
                if (trade.topic === "mobiles")
                    mobiles.push(trade);
                else if (trade.topic === "accessories") 
                accessories.push(trade);
            });
            res.render('trades', {mobiles: mobiles, accessories: accessories});
        })
        .catch(err => next(err));
};

exports.showTrade = (req, res, next) => {
    let id = req.params.sid;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Cannot find trade with id: " + id);
        err.status = 404;
        return next(err);
    }
    
    model.findById(id)
        .then(trade => {
            if (trade) {
                return res.render("trade", {trade});
            } else {
                let err = new Error("Cannot find a trade with id: " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.sid;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Cannot find connection with trade: " + trade);
        err.status = 404;
        return next(err);
    }
    
    model.findById(id)
        .then(trade => {
            if (trade) {
                return res.render("edit", {trade: trade});
            } else {
                let err = new Error("Cannot find a trade with id: " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

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
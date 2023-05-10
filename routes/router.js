const express = require("express");
var sanitize = require("mongo-sanitize");

const controller = require("../controllers/controller.js");
const router = express.Router();

function clean(req, res, next) {
    req.body = sanitize(req.body);
    next();
}

router.get('/', controller.index);
router.get('/newTrade', controller.new);
router.get('/makeTrade/:tid', controller.make);
router.post('/newTrade', clean, controller.postNew);
router.get('/about', controller.about);
router.get('/contact', controller.contact);
router.get('/trades', controller.trades);

module.exports = router;
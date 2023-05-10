const express = require("express");
const controller = require("../controllers/tradecontroller.js");
var sanitize = require("mongo-sanitize");

const router = express.Router();

function clean(req, res, next) {
    req.body = sanitize(req.body);
    next();
}

router.get('/:sid', controller.showConnection);

router.get('/:sid/edit', controller.edit);
router.post('/:sid/edit', clean, controller.saveEdit);

router.post("/:sid/watch", clean, controller.saveWatch);
router.post("/:sid/rmwatch", controller.removeWatch);

router.get("/make/:uid/:tid", controller.make);
router.post("/makeTrade", clean, controller.submitTrade);

router.post("/refuse", clean, controller.refuseTrade);
router.post("/accept", clean, controller.acceptTrade);

// Deletes a given connection
router.delete('/:sid', controller.delete);

module.exports = router;
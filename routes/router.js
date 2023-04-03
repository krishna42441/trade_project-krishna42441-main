const express = require("express");
const controller = require("../controllers/controller.js");

const router = express.Router();

router.get('/', controller.index);
router.get('/newTrade', controller.new);
router.post('/newTrade', controller.postNew);
router.get('/about', controller.about);
router.get('/contact', controller.contact);
router.get('/trades', controller.trades);
router.get('/trade/:sid', controller.showTrade);
router.get('/trade/:sid/edit', controller.edit);
router.post('/trade/:sid/edit', controller.saveEdit);
router.delete('/trade/:sid', controller.delete);

module.exports = router;
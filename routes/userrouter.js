const express = require("express");
const controller = require("../controllers/userController.js");
const {isLoggedIn} = require("../middleware/auth.js");

const router = express.Router();


router.get("/new", controller.new);


router.post("/new", controller.create);


router.get("/login", controller.showLogin);

router.post("/login", controller.login);

router.get("/profile", isLoggedIn, controller.profile);

router.get("/logout", isLoggedIn, controller.logout);
module.exports = router;

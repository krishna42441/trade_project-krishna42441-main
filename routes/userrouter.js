const express = require("express");
const rateLimit = require("express-rate-limit");
var sanitize = require("mongo-sanitize");

const controller = require("../controllers/userController.js");
const {isLoggedIn} = require("../middleware/auth.js");

const router = express.Router();

// Limit account requests to 5 per minute
const accountLimit = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: 'Too many authentication requests from this IP. Please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
})

function clean(req, res, next) {
    req.body = sanitize(req.body);
    next();
}

// GET /users/new
router.get("/new", controller.new);

// POST /users/new
router.post("/new", controller.create);
router.post("/new", accountLimit, controller.create);

// GET /users/login
router.get("/login", controller.showLogin);

// POST /users/login
router.post("/login", controller.login);
router.post("/login", accountLimit, controller.login);

// GET /users/profile
router.get("/profile", isLoggedIn, controller.profile);

// GET /users/logout
router.get("/logout", isLoggedIn, controller.logout);

module.exports = router;

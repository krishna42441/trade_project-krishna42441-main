const express = require("express");
const controller = require("../controllers/userController.js");
const {isLoggedIn} = require("../middleware/auth.js");

const router = express.Router();

// GET /users/new
router.get("/new", controller.new);

// POST /users/new
router.post("/new", controller.create);

// GET /users/login
router.get("/login", controller.showLogin);

// POST /users/login
router.post("/login", controller.login);

// GET /users/profile
router.get("/profile", isLoggedIn, controller.profile);

// GET /users/logout
router.get("/logout", isLoggedIn, controller.logout);

module.exports = router;

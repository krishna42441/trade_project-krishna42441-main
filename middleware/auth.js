
//
// Checks to see if the user is logged in
//
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.flash("error", "You need to login to see this page.");
    res.redirect("/users/login");
}
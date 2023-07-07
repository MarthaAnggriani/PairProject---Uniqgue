const authenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/login?error=login first please");
    }
    next();
}

module.exports = authenticated; 
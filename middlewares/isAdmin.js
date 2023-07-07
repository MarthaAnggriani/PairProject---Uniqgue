const isAdmin = (req, res, next) => {
    if (req.session.role !== "admin") {
        const error = "You are not admin";
        return res.redirect(`/?error=${error}`);
    }
    next();
}
module.exports = isAdmin;
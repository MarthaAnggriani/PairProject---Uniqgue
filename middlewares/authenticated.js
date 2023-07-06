const authenticated = (req, res, next) => {
    if (!req.session.userId) { //kalau sessionnya gak ada 
        return res.redirect('/login');
    }

    if (req.session.role === 'admin') {
        return res.redirect('/a');
    } else if (req.session.role === 'user') {
        return res.redirect('/u');
    }
    //kalau ada
    next();
}

module.exports = authenticated;
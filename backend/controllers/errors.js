exports.error404 = (req, res, next) => {
    res.status(404).render('404', { 
        title: '404 - Page Not Found',
        currentPage: '404',
        isLoggedIn: req.session.isLoggedIn,
        userType: req.session.user,
    });
};                                                                                  
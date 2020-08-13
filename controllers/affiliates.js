const User = require('../models/user')

exports.getAffiliate = (req, res, next) => {
    res.render('affiliate', 
        {pageTitle: 'Kigenni Affiliate',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken(),
        path: '/'
    })
    /* res.sendFile(path.join(__dirname, '../', 'views', 'affiliate.html'), {pageTitle: 'affiliate'}); */
}

exports.getDashboard = (req, res, next) => {

    User.findOne()
    .then(user => {
        const name = req.session.user.name;
        if(!req.session.isLoggedIn) {
            return res.redirect('/login')
        }
        
        res.render('dashboard', {
            pageTitle: 'Dashboard', 
            name: name,
            path: '/dashboard',
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken(),
        });
    })
    .catch(err => {
        console.log(err);
    })
    /* res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html')) */
}
exports.getAffiliate = (req, res, next) => {
    res.render('affiliate', 
        {pageTitle: 'Kigenni Affiliate',
        path: '/'
    })
    /* res.sendFile(path.join(__dirname, '../', 'views', 'affiliate.html'), {pageTitle: 'affiliate'}); */
}

exports.getDashboard = (req, res, next) => {

    res.render('dashboard', {
        pageTitle: 'Dashboard', 
        name: 'mike',
        path: '/dashboard'
    });
    /* res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html')) */
}
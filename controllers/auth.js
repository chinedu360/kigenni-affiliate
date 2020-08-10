exports.getLogin = (req, res, next) => {
    res.render('login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false
    });
};
  
exports.getSignup = (req, res, next) => {
    res.render('register', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
};
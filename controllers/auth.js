const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {

/*     console.log(req.session.isLoggedIn) */
    /* const isLoggedIn = req.get('Cookie').trim().split('=')[1]; */
    res.render('login', {
      path: '/login',
      pageTitle: 'Login',
      
      isAuthenticated: req.session.isLoggedIn,
    });
};

//set when the cookies expires for customers using the referal code by setting Expires="read how to set it"

exports.getSignup = (req, res, next) => {
    res.render('register', {
        path: '/signup',
      pageTitle: 'Signup',
      
      isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email}).then(userDoc => {
        if (userDoc) {
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 8)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login')
        })
    })
    .catch(err => {
        console.log(err)
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err)
                        res.redirect('/dashboard');
                    });
                }
                res.redirect('/login')
            })
            .catch(err => {
                console.log(err);
                res.redirect('/login');
        })

    })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
};
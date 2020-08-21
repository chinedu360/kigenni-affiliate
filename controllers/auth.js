const crypto = require('crypto');

const t = require('typy');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const eo = require('email-octopus');

const User = require('../models/user');

const apiKey = 'e21e3343-d0f1-44c4-bb20-1f790ed46614';
const username = 'Kigenni';
const password = 'Kigenni1234';
const emailOctopus = new eo.EmailOctopus(apiKey, username, password);

const listId = 'fa2a43de-ddc3-11ea-a3d0-06b4694bee2a'

const rfC = require('referral-codes');

/* console.log(rf); */


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

exports.getLogin = (req, res, next) => {

/*     console.log(req.session.isLoggedIn) */
    /* const isLoggedIn = req.get('Cookie').trim().split('=')[1]; */
    res.render('login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
    });
};

//set when the cookies expires for customers using the referal code by setting Expires="read how to set it"

exports.getSignup = (req, res, next) => {
    res.render('register', {
        path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
    });
};

exports.postSignup = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email}).then(userDoc => {
        if (userDoc) {
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const rf = rfC.generate({
                prefix: `${firstName}-`,  
                length: 4,
                count: 1
            })
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                referralCode: rf.toString()
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login')

            const options = {
                email_address: email,
                first_name: firstName,
                last_name: lastName
            };

            emailOctopus.lists.contacts.create(listId, options).then(function() {
                console.log('contact added');
            }).catch(err => {
                console.log(err)  
            });

            return transporter.sendMail({
                to: email,
                from: 'no-reply@kigenni.com',
                subject: 'Signup Succeded',
                html: `<h3>Hello ${firstName}</h3> 

                       <p>You successfully signed up!</p>

                       <p>Login <a href="https://kigenni-affiliate.herokuapp.com/login">here</a> to get your referral code!
                `
            })
            .catch(err => {
                console.log(err);  
            })
        });
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

exports.getReset = (req, res, next) => {
    res.render('reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken(),
      })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err)
            return res.redirect('/reset');
        }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            console.log('No account with that email found')
            return res.redirect('/reset')
        }
        user.resetToken = token,
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
    })
    .then(result => {
        res.redirect('/');
        transporter.sendMail({
            to: req.body.email,
            from: 'no-reply@kigenni.com',
            subject: 'Password Reset',
            html: `
                <p>if you did not make this request do not click the link</p>

                <p>The link expires in 1 hour</p>
                <p>click the <a href="https://kigenni-affiliate.herokuapp.com/reset/${token}">link</a> to set a new password.</p>
                
            `
        })/* https://kigenni-affiliate.herokuapp.com/ */
        {/* <p>click the <a href="https://kigenni-affiliate.herokuapp.com/reset/${token}">link</a> to set a new password.//prod */}
    })
    .catch(err => {
        console.log(err)
    })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        res.render('new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken(),
            userId: user._id.$oid,
            passwordToken: token
        })
    })
    .catch(err => {
        console.log(err)
    })

}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne(
        
        {
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now()}, 
        
        /* _id: userId */
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
    }) 
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save()
    })
    .then(result => {
        res.redirect('/login')
/*         transporter.sendMail({
            to: req.body.email,
            from: 'chinedu@kigenni.com',
            subject: 'Password Reset confirmed',
            html: `
                <p>Hooray!!! You've reset your password</p>
            ` 
        }) */
    })
    .catch(err => {
        console.log(err);
    })
}
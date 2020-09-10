const User = require('../models/user');
const Entry = require('../models/entries');
const { db } = require('../models/user');

var session = require('express-session');/* 
var MongoStore = require('connect-mongo')(session); */
var mongoose = require('mongoose');

const MONGO_URI2 = 'mongodb://Rigutsmile:Rigutsmile@ds135574.mlab.com:35574/writing'

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

/*     mongoose.connect(MONGO_URI2, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(entry => {
    Entry.findById("5f519f923dd35c0014de961a", (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            console.log(docs)
        }
    })
        .then(result => {
            console.log(result.data.writeType)
            if (result.data.promoCode === 'chinedu-yzcK') {
                console.log('done')
            }
        })
    }) 
    .catch(err => console.log(err)) */

/*     {
        date: 2017-09-25T09:53:32.626Z,
        _id: 59c8d2b5a6a112001238ff14,
        data: {
          other: '',
          sector: 'Consulting',
          work_exp: '10',
          birth_date: '7 January, 1996',
          state_res: 'Lagos',
          gender: 'Female',
          comtype: 'Email',
          email: 'juummyadejola@gmail.com',
          Full_Name: 'adejola adejumoke',
          writeType: 'CV'
        },
        uniqid: 'juummyadejola@gmail.com',
        __v: 0
      } */

    User.findOne()
    .then((user) => {

        mongoose.connect(MONGO_URI2, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(entry => {
        Entry.find( (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log(docs)
            }
        })
        .then(result => {
                const customerRef = result.data.promo_code[1];

                if (customerRef === rf) {
                    console.log(result)
                }
            })
        }) 
        .catch(err => console.log(err))

        const firstName = req.session.user.firstName;
        const rf = req.session.user.referralCode

        if(!req.session.isLoggedIn) {
            return res.redirect('/login')
        }
        
        res.render('dashboard', {
            pageTitle: 'Dashboard', 
            firstName: firstName,
            path: '/dashboard',
            isAuthenticated: req.session.isLoggedIn,
            csrfToken: req.csrfToken(),
            referralCode: rf
        });
    })
    .catch(err => {
        console.log(err);
    })
    /* res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html')) */
}
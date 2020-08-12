const PORT = process.env.PORT || 3000;
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const User = require('./models/user')

const express = require('express');
const bodyParser = require('body-parser');

const MONGO_URI = 'mongodb://kigenni-aff:kigenni-7218@ds149875.mlab.com:49875/kigenni-aff'

const app = express();
const store = new MongoDBStore({
    uri: MONGO_URI, 
    collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const dashboardRoutes = require('./routes/dashboard') 
const affiliateLandingRoutes = require('./routes/affiliate-landing')
const authRoutes = require('./routes/auth')


app.use(bodyParser.urlencoded({ extended: false}));
//Here we render the css files staticaly
app.use(express.static(path.join(__dirname, 'public')))
app.use(session ({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

//initalialse csrf after session is crseated bcos it would use it
/* app.use(csrfProtection); */

app.use(dashboardRoutes);
app.use(affiliateLandingRoutes);
app.use(authRoutes)

mongoose.connect(MONGO_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(result => {

    const server = http.createServer(app);
    server.listen(PORT);

    console.log("connected to the DB")
}).catch(err => {
    console.log(err);
})


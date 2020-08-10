const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const dashboardRoutes = require('./routes/dashboard') 
const affiliateLandingRoutes = require('./routes/affiliate-landing')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false}));
//Here we render the css files staticaly
app.use(express.static(path.join(__dirname, 'public')))

app.use(dashboardRoutes);
app.use(affiliateLandingRoutes);
app.use(authRoutes)

const server = http.createServer(app);

server.listen(3000);

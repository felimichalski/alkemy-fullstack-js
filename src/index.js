const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const { database } = require('./keys')

// Initializing
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {

    app.locals.user = req.user;
    
    next();
})

// Public Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes/index.routes.js'));
app.use('/auth', require('./routes/auth.routes.js'));
app.use('/*', (req, res) => {
    res.redirect('/');
})

// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
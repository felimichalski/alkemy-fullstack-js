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
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {

    app.locals.message = req.flash('message');
    // Solving bug: connect-flash saves app.locals.message as [] instead of undefined and ejs doesn't recognize as undefined
    if(app.locals.message.length < 1) {
        app.locals.message = undefined;
    }
    
    app.locals.success = req.flash('success');
    if(app.locals.success.length < 1) {
        app.locals.success = undefined;
    }
    app.locals.email = req.body.email;
    app.locals.user = req.user;
    
    next();
})

// Public Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes/index.routes.js'));
app.use('/auth', require('./routes/auth.routes.js'));
app.use('/dashboard', require('./routes/dashboard.routes.js'));
app.use('/*', (req, res) => {
    res.redirect('/');
})

// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
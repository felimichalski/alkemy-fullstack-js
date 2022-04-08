const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')
const flash = require('connect-flash');
require('dotenv').config();

const { database } = require('./keys')

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))

// Global Variables
app.use((req, res, next) => {

    app.locals.user = req.user;
    
    next();
})

// Routes
app.use(require('./routes/index'))

// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
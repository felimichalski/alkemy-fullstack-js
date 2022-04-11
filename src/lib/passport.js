const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const { encryptPassword, matchPassword } = require('./helpers');

// System to register users and save them in database
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {

    // Checking that the email doesn't exist in database
    const rows = await pool.query('SELECT * FROM clients WHERE EMAIL = ?', [email]);
    if(rows.length > 0) {
        return done(null, false, req.flash('message', 'Email is already in use'))
    }

    const { fullname } = req.body;

    const newUser = {
        email,
        password,
        fullname
    }

    newUser.password = await encryptPassword(password);

    const result = await pool.query('INSERT INTO clients SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

// System to verify user's credentials
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM clients WHERE EMAIL = ?', [email])
    if(rows.length > 0) {
        const user = rows[0];
        const validPassword = await matchPassword(password, user.PASSWORD);
        if (validPassword) {
            done(null, user);
        } else {
            done(null, false, req.flash('message', 'Incorrect email or password'))
        }
    } else {
        return done(null, false, req.flash('message', 'Incorrect email or password'))
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM clients WHERE ID_CLIENT = ?', [id]);
    done(null, rows[0]);
});
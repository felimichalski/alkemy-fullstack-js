const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const { encryptPassword, matchPassword } = require('./helpers');

// System to register users and save them in database
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {

    // Checking that the username doesn't exist in database
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length > 0) {
        return done(null, false, req.flash('message', 'Username is already in use'))
    }

    const { fullname } = req.body;

    const newUser = {
        username,
        password,
        fullname
    }

    newUser.password = await encryptPassword(password);

    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

// System to verify user's credentials
passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if(rows.length > 0) {
        const user = rows[0];
        const validPassword = await matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Successfully logged'));
        } else {
            done(null, false, req.flash('message', 'Incorrect password'))
        }
    } else {
        return done(null, false, req.flash('message', 'Username does not exist'))
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE ID = ?', [id]);
    done(null, rows[0]);
});
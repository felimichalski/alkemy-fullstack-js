const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const { encryptPassword, matchPassword } = require('./bcrypt');

const nodemailer = require('nodemailer');
const e = require('connect-flash');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL, // put your gmail account
      pass: process.env.NODEMAILER_PASSWORD, // to get this password, activate 2-Step Verification in myaccount.google.com and then create an App password whose app is "Other" (set any name)
    },
});

// System to register users and save them in database
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {

    email = email.toLowerCase();

    // Checking that the email doesn't exist in database
    const rows = await pool.query('SELECT * FROM clients WHERE EMAIL = ?', [email]);
    if(rows.length > 0) {
        return done(null, false, req.flash('message', 'Email is already in use'))
    }

    let { fullname } = req.body;

    fullname = fullname.split(' ');
    for (var i = 0; i < fullname.length; i++) {
        fullname[i] = fullname[i].charAt(0).toUpperCase() + fullname[i].slice(1).toLowerCase();
    }

    fullname = fullname.join(' ');

    const newUser = {
        email,
        password,
        fullname
    }

    newUser.password = await encryptPassword(password);

    try {
        const result = await pool.query('INSERT INTO clients SET ?', [newUser]);
        newUser.id = result.insertId;
        await transporter.sendMail({
            from: `"Accountapp" <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject: "Email verification",
            html:  `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification</title>
            </head>
            <body>
                    <h2>Verify Your Email.</h2>
                    <p>Thank you for register in Accountapp. To start using our services, we need you to verify your email.</p>
                    <a href="http://localhost:${process.env.PORT}/auth/verification?email=${email}">Verify Now</a>
            </body>
            </html>
            `
        });
        return done(null, newUser);
    } catch (err) {
        console.error(err);
        return done(null, false)
    }
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
            (user.IS_VERIFIED === 1)?done(null, user):done(null, false, req.flash('message', 'Email has not been verificated yet. Please check your mailbox.'));
        } else {
            done(null, false, req.flash('message', 'Incorrect email or password'));
        }
    } else {
        return done(null, false, req.flash('message', 'Incorrect email or password'));
    }
}));

passport.use('local.verification', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM clients WHERE EMAIL = ?', [email]);
    if(rows.length > 0) {
        const user = rows[0];
        if(user.IS_VERIFIED === 1) {
            done(null, false, req.flash('message', 'Email is already verificated.'))
        } else {
            try {
                await pool.query('UPDATE clients SET IS_VERIFIED = 1 WHERE EMAIL = ?', [email]);
                done(null, user, req.flash('success', 'Email verified successfully'))
            } catch (err) {
                console.error(err);
                done(null, false, req.flash('message', 'An error has occurred. Try again later.'))
            }
        }
    } else {
        done(null, false, req.flash('message', 'Email not registered.'));
    }
}));

passport.use('local.recover', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'email',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM clients WHERE EMAIL = ?', [email]);
    if(rows.length > 0) {
        const user = rows[0];
        try {
            await transporter.sendMail({
                from: `"Accountapp" <${process.env.NODEMAILER_EMAIL}>`,
                to: email,
                subject: "Forgotten password",
                html:  `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Forgotten password</title>
                </head>
                <body>
                        <h2>Change your password.</h2>
                        <p>If you requested a password change, please click the link below to continue.</p>
                        <a href="http://localhost:${process.env.PORT}/auth/change?email=${email}">Change Now</a>
                </body>
                </html>
                `
            });
            return done(null, user, req.flash('success', `We have sent a mail to ${email}`));
        } catch (err) {
            console.error(err);
            return done(null, false, req.flash('message', 'An error has ocurred, please try again later.'))
        }
    } else {
        return done(null, false, req.flash('message', "The email entered doesn't exist."))
    }
}));

passport.use('local.change', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM clients WHERE EMAIL = ?', [email]);
    if(rows.length > 0) {
        const user = rows[0];
        try {
            password = await encryptPassword(password);
            await pool.query(`UPDATE clients SET PASSWORD = '${password}' WHERE EMAIL = ?`, [email]);
            done(null, user, req.flash('success', 'Password changed successfully'))
        } catch (err) {
            console.error(err);
            done(null, false, req.flash('message', 'An error has occurred. Try again later.'))
        }
    } else {
        return done(null, false, req.flash('message', "The email entered doesn't exist."))
    }
}));

passport.serializeUser((user, done) => {
    (user.id)?done(null, user.id):done(null, user.ID_CLIENT);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM clients WHERE ID_CLIENT = ?', [id]);
    done(null, rows[0]);
});
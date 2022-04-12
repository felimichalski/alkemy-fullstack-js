const { Router } = require('express');
const router = Router();

const pool = require('../database');

const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../lib/protect');
const e = require('connect-flash');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    session: false,
    successRedirect: '/auth/verification',
    failureRedirect: '/auth/signup',
    failureFlash: true
}))

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login')
});

router.post('/login', isNotLoggedIn, passport.authenticate('local.login', {
    successRedirect: '/dashboard/home',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/verification', isNotLoggedIn, passport.authenticate('local.verification', {
            session: false,
            successRedirect: '/auth/login',
            failureRedirect: '/auth/login',
            failureFlash: true,
            successFlash: true
}));

router.post('/logout', isLoggedIn, (req,res) => {
    req.logOut();
    req.session.destroy(() => {
        res.redirect('/');
    });
});


module.exports = router;
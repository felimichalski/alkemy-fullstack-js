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
    failureRedirect: '/auth/signup',
    failureFlash: true,
}), (req, res) => {
    res.redirect(307, '/auth/success'); // 307 status code is for redirecting with post method so people can't access to /auth/success just by typing that URL
})

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login')
});

router.post('/login', isNotLoggedIn, passport.authenticate('local.login', {
    successRedirect: '/dashboard/home',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.post('/success', isNotLoggedIn, (req, res) => {
    res.render('auth/success', {email: req.app.locals.email});
})

router.get('/recover', isNotLoggedIn, (req, res) => {
    res.render('auth/recover')
});

router.post('/recover', isNotLoggedIn, passport.authenticate('local.recover', {
    session: false,
    successRedirect: '/auth/login',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true
}));

router.get('/change', isNotLoggedIn, (req, res) => {
    const email = req.query.email;
    if(email) {
        res.render('auth/change', {email});
    } else {
        res.redirect('/auth/login');
    }
});

router.post('/change', isNotLoggedIn, passport.authenticate('local.change', {
    session: false,
    successRedirect: '/auth/login',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true
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
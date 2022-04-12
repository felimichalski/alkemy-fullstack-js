const { Router } = require('express');
const router = Router();

const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../lib/protect');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/dashboard/home',
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
}))

router.post('/logout', isLoggedIn, (req,res) => {
    req.logOut();
    req.session.destroy(() => {
        res.redirect('/');
    });
})


module.exports = router;
const { Router } = require('express');
const router = Router();

const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/dashboard/home',
    failureRedirect: '/auth/signup',
    failureFlash: true
}))

router.get('/login', (req, res) => {
    res.render('auth/login')
});

router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/dashboard/home',
    failureRedirect: '/auth/login',
    failureFlash: true
}))

router.get('/logout', (req,res) => {
    req.logOut();
    req.session.destroy(() => {
        res.redirect('/');
    });
})


module.exports = router;
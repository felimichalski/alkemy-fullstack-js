const passport = require('passport');

const ctrl = {};

ctrl.signup = passport.authenticate('local.signup', {
    session: false,
    successRedirect: '/auth/success',
    failureRedirect: '/auth/signup',
    failureFlash: true,
});

ctrl.verification = passport.authenticate('local.verification', {
    session: false,
    successRedirect: '/auth/login',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true
});

ctrl.login = passport.authenticate('local.login', {
    successRedirect: '/dashboard/home',
    failureRedirect: '/auth/login',
    failureFlash: true
});

ctrl.recover =  passport.authenticate('local.recover', {
    session: false,
    successRedirect: '/auth/login',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true
});

ctrl.change = passport.authenticate('local.change', {
    session: false,
    successRedirect: '/auth/login',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: true
});

ctrl.logout = (req,res) => {
    req.logOut();
    req.session.destroy(() => {
        res.redirect('/');
    });
}

module.exports = ctrl;
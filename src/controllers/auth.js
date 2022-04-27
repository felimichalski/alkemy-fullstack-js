const passport = require('passport');

const ctrl = {};

ctrl.signup = passport.authenticate('local.signup', {
    session: false,
    failureRedirect: '/auth/signup',
    failureFlash: true,
}), (req, res) => {
    res.redirect(307, '/auth/success'); // 307 status code is for redirecting with post method so people can't access to /auth/success just by typing that URL
}

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

ctrl.success = (req, res) => {
    res.render('auth/success', {email: req.app.locals.email});
};

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
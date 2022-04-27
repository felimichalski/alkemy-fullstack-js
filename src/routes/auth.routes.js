const { Router } = require('express');
const router = Router();

const { isLoggedIn, isNotLoggedIn } = require('../lib/protect');

const controllers = require('../controllers/auth')

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup')
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login')
});

router.get('/recover', isNotLoggedIn, (req, res) => {
    res.render('auth/recover')
});

router.get('/change', isNotLoggedIn, (req, res) => {
    const email = req.query.email;
    if(email) {
        res.render('auth/change', {email});
    } else {
        res.redirect('/auth/login');
    }
});

router.get('/verification', isNotLoggedIn, controllers.verification);

router.post('/signup', isNotLoggedIn, controllers.signup)

router.post('/login', isNotLoggedIn, controllers.login);

router.post('/success', isNotLoggedIn, controllers.success)

router.post('/recover', isNotLoggedIn, controllers.recover);

router.post('/change', isNotLoggedIn, controllers.change);

router.post('/logout', isLoggedIn, controllers.logout);


module.exports = router;
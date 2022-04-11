const { Router } = require('express');
const router = Router();

router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

router.get('/login', (req, res) => {
    res.render('auth/login')
});

router.get('/signup', (req, res) => {
    res.render('auth/signup')
});


module.exports = router;
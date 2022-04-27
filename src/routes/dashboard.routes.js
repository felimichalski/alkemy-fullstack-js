const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('../lib/protect');

const controllers = require('../controllers/user')

router.get('/', isLoggedIn, async(req, res) => {
    res.render('user/dashboard');
});

router.get('/list', isLoggedIn, async(req, res) => {
    if(req.originalUrl == '/dashboard/list?filters=') { // Removing leftovers of get petitions
        return res.redirect('/dashboard/list');
    }

    res.render('user/list')
});

router.get('/new', isLoggedIn, async(req, res) => {
    res.render('user/new')
});

router.get('/list/modify/:id_operation', isLoggedIn, (req, res) => {
    res.render('user/modify');
});

router.post('/new', isLoggedIn, controllers.new);

router.post('/list/delete/:id_operation', isLoggedIn, controllers.delete);

router.post('/list/modify/:id_operation', isLoggedIn, controllers.modify)

module.exports = router;
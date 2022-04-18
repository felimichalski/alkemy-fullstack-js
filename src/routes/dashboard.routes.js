const { Router } = require('express');
const router = Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');

router.get('/', isLoggedIn, async(req, res) => {
    res.render('dashboard/main');
});


module.exports = router;
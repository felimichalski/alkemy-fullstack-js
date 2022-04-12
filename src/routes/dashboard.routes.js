const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('../lib/protect');

router.get('/', isLoggedIn, (req, res) => {
    res.render('dashboard/main')
});


module.exports = router;
const { Router } = require('express');
const router = Router();

const { isNotLoggedIn } = require('../lib/protect');

router.get('/', isNotLoggedIn, (req, res) => {
    res.render('home')
});


module.exports = router;
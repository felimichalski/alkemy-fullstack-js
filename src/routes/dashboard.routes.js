const { Router } = require('express');
const router = Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');

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

router.post('/new', isLoggedIn, async(req, res) => {
    
    let { category, date, amount, concept, newCategory } = req.body;
    
    if(category === '') {
        category = null; 
    } else if(category === 'other') {
        category = newCategory;
    }
    
    if(category) {
        category = category.split(' ');
        for (var i = 0; i < category.length; i++) {
            category[i] = category[i].charAt(0).toUpperCase() + category[i].slice(1).toLowerCase();
        }
        category = category.join(' '); // Formatting category names to have the first character of each word uppercase
    }

    if(date == '') {
        date = undefined; // To use then in inline if statements
    }

    if(category) {
        if(concept === 'income') {
            try {
                (date)?await pool.query(`INSERT INTO income (I_VALUE, CREATED_AT, CATEGORY, ID_CLIENT) VALUES (${amount}, '${date}', '${category}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO income (I_VALUE, CATEGORY, ID_CLIENT) VALUES (${amount}, '${category}', ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        } else {
            try {
                (date)?await pool.query(`INSERT INTO expenses (E_VALUE, CREATED_AT, CATEGORY, ID_CLIENT) VALUES (${amount}, '${date}', '${category}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO expenses (E_VALUE, CATEGORY, ID_CLIENT) VALUES (${amount}, '${category}', ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        }
    } else {
        if(concept === 'income') {
            try {
                (date)?await pool.query(`INSERT INTO income (I_VALUE, CREATED_AT, ID_CLIENT) VALUES (${amount}, '${date}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO income (I_VALUE, ID_CLIENT) VALUES (${amount}, ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        } else {
            try {
                (date)?await pool.query(`INSERT INTO expenses (E_VALUE, CREATED_AT, ID_CLIENT) VALUES (${amount}, '${date}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO expenses (E_VALUE, ID_CLIENT) VALUES (${amount}, ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        }
    }
    res.redirect('/dashboard/list');
});

router.post('/list/delete/:id_operation', isLoggedIn, async (req, res) => {

    let operation = req.params.id_operation;
    
    if(operation.charAt(0) == 'e') {
        try {
            await pool.query('DELETE FROM expenses WHERE E_ID_OPERATION = ?', [operation.slice(1)]);
            req.flash('success', 'Operation deleted successfully');
        } catch (err) {
            console.log(err)
            req.flash('message', 'An error has ocurred, please try again later')
        }
    } else {
        try {
            await pool.query('DELETE FROM income WHERE I_ID_OPERATION = ?', [operation.slice(1)]);
            req.flash('success', 'Operation deleted successfully');
        } catch (err) {
            console.log(err)
            req.flash('message', 'An error has ocurred, please try again later')
        }
    }
    res.redirect('/dashboard/list');
});

router.post('/list/modify/:id_operation', isLoggedIn, async(req, res) => {

    let operation = req.params.id_operation;
    
    let { amount, date, category, newCategory } = req.body;

    if(category === '') {
        category = null; 
    } else if(category === 'other') {
        category = newCategory;
    }
    
    if(category) {
        category = category.split(' ');
        for (var i = 0; i < category.length; i++) {
            category[i] = category[i].charAt(0).toUpperCase() + category[i].slice(1).toLowerCase();
        }
        category = category.join(' '); // Formatting category names to have the first character of each word uppercase
        if(operation.charAt(0) == 'e') {
            try {
                (date)?await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${category}' WHERE E_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = default, CATEGORY = '${category}' WHERE E_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        } else {
            try {
                (date)?await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${category}' WHERE I_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = default, CATEGORY = '${category}' WHERE I_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        }
    } else {
        if(operation.charAt(0) == 'e') {
            try {
                (date)?await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = '${date}' WHERE E_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = default WHERE E_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        } else {
            try {
                (date)?await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = '${date}' WHERE I_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = default WHERE I_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        }
    }

    res.redirect('/dashboard/list');
})

module.exports = router;
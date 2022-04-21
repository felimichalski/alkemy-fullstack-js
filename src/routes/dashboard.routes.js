const e = require('connect-flash');
const { Router } = require('express');
const router = Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');



router.get('/', isLoggedIn, async(req, res) => {
    
    const user = req.app.locals.user;

    const expenses = await pool.query(`SELECT E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const income = await pool.query(`SELECT I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const result = expenses.concat(income) // Getting all income and expenses and joining them in a new array

    const rows = result.sort((a, b) => b.CREATED_AT - a.CREATED_AT).slice(0, 10); // Sorting last 10 income and expenses by date
    
    res.render('user/dashboard', {operations: rows});
});

router.get('/list', isLoggedIn, async(req, res) => {

    const user = req.app.locals.user;

    const expenses = await pool.query(`SELECT E_ID_OPERATION, E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const income = await pool.query(`SELECT I_ID_OPERATION, I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const result = expenses.concat(income)

    const pages = Math.ceil(result.length / 10); // Counting number of pages every 10 items
    let page = (req.query.page) ? parseInt(req.query.page) : 1; // Checking page of the list
    
    if(page > pages || page < 1) {
        return res.redirect('/dashboard/list'); // Preventing the user from manually entering a non-existent page
    }
    
    let totalPages = [];
    for(let i = 1; i <= pages; i++) {
        totalPages.push(i); // Creating an array of pages
    }
    
    const rows = result.sort((a, b) => b.CREATED_AT - a.CREATED_AT).slice((page - 1) * 10, page * 10); // Sorting 10 income and expenses by date according the page

    if(rows.length > 1) { // Checking that the page has more than 1 row
        res.render('user/list', {operations: rows, first: (page - 1) * 10 + 1, last: (page == pages)?result.length:page * 10, totalPages, active: page});
    } else {
        res.render('user/list', {operations: rows, first: undefined, last: (page == pages)?result.length:page * 10, totalPages, active: page});
    }
});

router.post('/list/delete/:id_operation', async (req, res) => {
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


module.exports = router;
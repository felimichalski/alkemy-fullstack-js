const { Router } = require('express');
const router = Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');

router.post('/operations', isLoggedIn, async(req, res) => {

    const user = req.user;

    const expenses = await pool.query(`SELECT E_ID_OPERATION, CONCEPT, E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const income = await pool.query(`SELECT I_ID_OPERATION, CONCEPT, I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);

    const result = expenses.concat(income);

    const rows = result.sort((a, b) => a.CREATED_AT - b.CREATED_AT);

    res.json(rows)
})

router.post('/operations/filters', isLoggedIn, async(req, res) => {

    let { filters, page } = req.body;
    (page)?page = parseInt(page):page = 1;    
    
    const user = req.user;
    
    let expenses = [];
    let income = [];
    
    if(filters) {
        filters = filters.split(',')
        let filtersString = "";
        for ([index, f] of filters.entries()) { // Adding '' to each filter for use in sql query
            if(index == filters.length - 1) {
                filtersString += `'${f}'`
            } else {
                filtersString += `'${f}',`
            }
        }

        expenses = await pool.query(`SELECT E_ID_OPERATION, CONCEPT, E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT} AND CATEGORY IN (${filtersString})`);
        income = await pool.query(`SELECT I_ID_OPERATION, CONCEPT, I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT} AND CATEGORY IN (${filtersString})`);
    } else {
        expenses = await pool.query(`SELECT E_ID_OPERATION, CONCEPT, E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
        income = await pool.query(`SELECT I_ID_OPERATION, CONCEPT, I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    }

    const result = expenses.concat(income);

    // Pagination system
    const pages = Math.ceil(result.length / 10); // Counting number of pages every 10 items

    let totalPages = [];
    for(let i = 1; i <= pages; i++) {
        totalPages.push(i); // Creating an array of pages
    }

    if(totalPages.length > 3) { // Reducing number of pages to 3
        if(page == 1) {
            totalPages = totalPages.slice(0, 3); // Show active and next two if is the first page
        } else if(page == totalPages.length) {
            totalPages = totalPages.slice(totalPages.length - 3, totalPages.length); // Show active and previous two if is the last page
        } else {
            totalPages = totalPages.slice(page - 2, page + 1); // Show active, previuos and next
        }

        if(page - 2 > 0) {
            totalPages.unshift('prev'); // Active has 2 previuos pages
        }

        if(page + 2 <= pages) {
            totalPages.push('next') // Active has 2 next pages
        }
    }

    // End pagination system

    const rows = result.sort((a, b) => b.CREATED_AT - a.CREATED_AT).slice((page - 1) * 10, page * 10); // Sorting 10 income and expenses by date according the page

    if(rows.length > 1) { // Checking that the page has more than 1 row
        res.json({
            rows,
            first: (page - 1) * 10 + 1,
            last: (page == pages)?result.length:page * 10,
            totalPages,
            active: page,
        });
    } else {
        res.json({
            rows,
            first: undefined,
            last: (page == pages)?result.length:page * 10,
            totalPages,
            active: page,
        });
    }
});

router.post('/categories', isLoggedIn, async(req, res) => {

    const user = req.user;

    const eCategories = await pool.query(`SELECT CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const iCategories = await pool.query(`SELECT CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const categories = eCategories.concat(iCategories);
    
    let rows = [];

    for(cat of categories) {
        if(cat.CATEGORY && !rows.includes(cat.CATEGORY)) {
            rows.push(cat.CATEGORY);
        }
    }
    
    res.json(rows);

});

router.post('/operations/:id', isLoggedIn, async(req, res) => {

    const user = req.user;

    const operation = req.params.id;

    let result;
    
    if(operation.charAt(0) == 'e') {
        result = await pool.query(`SELECT E_ID_OPERATION, CONCEPT, E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE E_ID_OPERATION = ${operation.slice(1)} AND ID_CLIENT = ${user.ID_CLIENT}`);
    } else {
        result = await pool.query(`SELECT I_ID_OPERATION, CONCEPT, I_VALUE, CREATED_AT, CATEGORY FROM income WHERE I_ID_OPERATION = ${operation.slice(1)} AND ID_CLIENT = ${user.ID_CLIENT}`);
    }
    
    const rows = result[0];

    res.json(rows);
})

module.exports = router;
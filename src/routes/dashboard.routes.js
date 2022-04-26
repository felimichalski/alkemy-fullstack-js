const { Router } = require('express');
const router = Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');

router.get('/', isLoggedIn, async(req, res) => {
    
    const user = req.user;

    const expenses = await pool.query(`SELECT E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const income = await pool.query(`SELECT I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const result = expenses.concat(income) // Getting all income and expenses and joining them in a new array

    const rows = result.sort((a, b) => b.CREATED_AT - a.CREATED_AT).slice(0, 10); // Sorting last 10 income and expenses by date
    
    res.render('user/dashboard', {operations: rows});
});

router.get('/list', isLoggedIn, async(req, res) => {

    if(req.originalUrl == '/dashboard/list?filters=') { // Removing leftovers of get petitions
        return res.redirect('/dashboard/list');
    }

    // Global variables of the function
    let filters = [];
    let income = [];
    let expenses = [];
    let categories = [];
    let eCategories = [];
    let iCategories = [];
    let filtersString = "";
    const user = req.user;

    if(req.query.filters) {
        req.query.filters.split(',').map((f) => {
            if(!filters.includes(f)) {
                filters.push(f) // Adding user filters to filters array 
            }
        });
            
        for ([index, f] of filters.entries()) { // Transforming filters array into string for use in sql query
            if(index == filters.length - 1) {
                filtersString += `'${f}'`
            } else {
                filtersString += `'${f}',`
            }
        }

    } else {
        filters = null;
    }

    if(filtersString) {
        expenses = await pool.query(`SELECT E_ID_OPERATION, E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT} AND CATEGORY IN (${filtersString})`);
        income = await pool.query(`SELECT I_ID_OPERATION, I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT} AND CATEGORY IN (${filtersString})`);
        eCategories = await pool.query(`SELECT CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`); // Getting the categories of the unselected rows too
        iCategories = await pool.query(`SELECT CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`); // Getting the categories of the unselected rows too
    } else {
        expenses = await pool.query(`SELECT E_ID_OPERATION, E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
        income = await pool.query(`SELECT I_ID_OPERATION, I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    }
    
    const result = expenses.concat(income);
    const resultCategories = eCategories.concat(iCategories);

    if(resultCategories.length > 0) {
        for(r of resultCategories) {
            if(r.CATEGORY && !categories.includes(r.CATEGORY)) {
                categories.push(r.CATEGORY);
            }
        }
    } else {
        for(r of result) {
            if(r.CATEGORY && !categories.includes(r.CATEGORY)) {
                categories.push(r.CATEGORY);
            }
        }
    }

    categories = categories.sort(); // Sorting cateogries alphabetically
    
    const pages = Math.ceil(result.length / 10); // Counting number of pages every 10 items
    let page = (req.query.page) ? parseInt(req.query.page) : 1; // Checking page of the list
    
    // if(page > pages || page < 1) {
    //     return res.redirect('/dashboard/list'); // Preventing the user from manually entering a non-existent page
    // }
    
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
    
    const rows = result.sort((a, b) => b.CREATED_AT - a.CREATED_AT).slice((page - 1) * 10, page * 10); // Sorting 10 income and expenses by date according the page

    if(rows.length > 1) { // Checking that the page has more than 1 row
        res.render('user/list', {
            operations: rows,
            first: (page - 1) * 10 + 1,
            last: (page == pages)?result.length:page * 10,
            totalPages,
            active: page,
            categories:(categories.length > 0)?categories:undefined,
            filters
        });
    } else {
        res.render('user/list', {
            operations: rows,
            first: undefined,
            last: (page == pages)?result.length:page * 10,
            totalPages,
            active: page,
            categories: (categories.length > 0)?categories:undefined,
            filters
        });
    }
});

router.get('/new', async(req, res) => {

    const user = req.user;

    const eCategories = await pool.query(`SELECT CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const iCategories = await pool.query(`SELECT CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);

    const result = eCategories.concat(iCategories).sort((a, b) => a - b); // Selecting all the categories and sorting alphabetically

    let categories = [];

    for(r of result) {
        if(r.CATEGORY && !categories.includes(r.CATEGORY)) {
            categories.push(r.CATEGORY); // Adding non-repeating categories to categories array
        }
    }

    if(categories.length < 1) {
        categories = undefined; // Preventing showing something if there are no categories
    }

    res.render('user/new', {categories})
});

router.post('/new', async(req, res) => {
    
    let category = req.body.category;
    
    if(category === '') {
        category = null; 
    } else if(category === 'other') {
        category = req.body.newCategory;
    }
    
    if(category) {
        category = category.split(' ');
        for (var i = 0; i < category.length; i++) {
            category[i] = category[i].charAt(0).toUpperCase() + category[i].slice(1).toLowerCase();
        }
        category = category.join(' '); // Formatting category names to have the first character of each word uppercase
    }

    if(category) {
        if(req.body.concept === 'income') {
            try {
                await pool.query(`INSERT INTO income (I_VALUE, CATEGORY, ID_CLIENT) VALUES (${req.body.amount}, '${category}', ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        } else {
            try {
                await pool.query(`INSERT INTO expenses (E_VALUE, CATEGORY, ID_CLIENT) VALUES (${req.body.amount}, '${category}', ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        }
    } else {
        if(req.body.concept === 'income') {
            try {
                await pool.query(`INSERT INTO income (I_VALUE, ID_CLIENT) VALUES (${req.body.amount}, ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        } else {
            try {
                await pool.query(`INSERT INTO expenses (E_VALUE, ID_CLIENT) VALUES (${req.body.amount}, ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        }
    }
    res.redirect('/dashboard/list');
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

router.get('/list/modify/:id_operation', async(req, res) => {

    const user = req.user;

    const eCategories = await pool.query(`SELECT CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const iCategories = await pool.query(`SELECT CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);

    let result = eCategories.concat(iCategories).sort((a, b) => a - b);

    let categories = [];

    for(r of result) {
        if(r.CATEGORY && !categories.includes(r.CATEGORY)) {
            categories.push(r.CATEGORY);
        }
    }

    if(categories.length < 1) {
        categories = undefined;
    }

    const operation = req.params.id_operation;
    
    let data = [];
    
    if(operation.charAt(0) == 'e') {
        try {
            data = await pool.query('SELECT * FROM expenses WHERE E_ID_OPERATION = ?', [operation.slice(1)]);
        } catch (err) {
            console.log(err);
            req.flash('message', 'An error has ocurred, please try again later')
            return res.redirect('/dashboard/list');
        }
    } else {
        try {
            data = await pool.query('SELECT * FROM income WHERE I_ID_OPERATION = ?', [operation.slice(1)]);
        } catch (err) {
            console.log(err)
            req.flash('message', 'An error has ocurred, please try again later')
            return res.redirect('/dashboard/list');
        }
    }

    res.render('user/modify', {operation: data[0], categories});
});

router.post('/list/modify/:id_operation', async(req, res) => {

    let operation = req.params.id_operation;
    
    let { amount, date, category, newCategory } = req.body;

    if(category == '') {
        if(operation.charAt(0) == 'e') {
            try {
                await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = '${date}' WHERE E_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        } else {
            try {
                await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = '${date}' WHERE I_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        }
    } else if(category == 'other') {
        newCategory = newCategory.split(' ');
        for (var i = 0; i < newCategory.length; i++) {
            newCategory[i] = newCategory[i].charAt(0).toUpperCase() + newCategory[i].slice(1).toLowerCase();
        }
        newCategory = newCategory.join(' '); // Formatting category names to have the first character of each word uppercase
        if(operation.charAt(0) == 'e') {
            try {
                await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${newCategory}' WHERE E_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        } else {
            try {
                await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${newCategory}' WHERE I_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        }
    } else {
        if(operation.charAt(0) == 'e') {
            try {
                await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${category}' WHERE E_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        } else {
            try {
                await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${category}' WHERE I_ID_OPERATION = ${operation.slice(1)}`);
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
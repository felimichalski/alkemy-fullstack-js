const { Router } = require('express');
const router = Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');

router.post('/operations', isLoggedIn, async(req, res) => {
    const user = req.user;

    const expenses = await pool.query(`SELECT E_VALUE, CREATED_AT, CATEGORY FROM expenses WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const income = await pool.query(`SELECT I_VALUE, CREATED_AT, CATEGORY FROM income WHERE ID_CLIENT = ${user.ID_CLIENT}`);
    const result = expenses.concat(income)
    
    const rows = result.sort((a, b) => a.CREATED_AT - b.CREATED_AT); // Sorting income and expenses by date to show in a chart

    res.json(rows);
});

module.exports = router;
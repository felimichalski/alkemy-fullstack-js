const pool = require('../database');

const ctrl = {};

ctrl.new = async(req, res) => {
    let { concept, category, date, amount, type, newCategory } = req.body;
    
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
        if(type === 'income') {
            try {
                (date)?await pool.query(`INSERT INTO income (CONCEPT, I_VALUE, CREATED_AT, CATEGORY, ID_CLIENT) VALUES ('${concept}', ${amount}, '${date}', '${category}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO income (CONCEPT, I_VALUE, CATEGORY, ID_CLIENT) VALUES ('${concept}', ${amount}, '${category}', ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        } else {
            try {
                (date)?await pool.query(`INSERT INTO expenses (CONCEPT, E_VALUE, CREATED_AT, CATEGORY, ID_CLIENT) VALUES ('${concept}', ${amount}, '${date}', '${category}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO expenses (CONCEPT, E_VALUE, CATEGORY, ID_CLIENT) VALUES ('${concept}', ${amount}, '${category}', ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        }
    } else {
        if(type === 'income') {
            try {
                (date)?await pool.query(`INSERT INTO income (CONCEPT, I_VALUE, CREATED_AT, ID_CLIENT) VALUES ('${concept}', ${amount}, '${date}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO income (CONCEPT, I_VALUE, ID_CLIENT) VALUES ('${concept}', ${amount}, ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        } else {
            try {
                (date)?await pool.query(`INSERT INTO expenses (CONCEPT, E_VALUE, CREATED_AT, ID_CLIENT) VALUES ('${concept}', ${amount}, '${date}', ${req.user.ID_CLIENT})`):await pool.query(`INSERT INTO expenses (CONCEPT, E_VALUE, ID_CLIENT) VALUES ('${concept}', ${amount}, ${req.user.ID_CLIENT})`);
                req.flash('success', 'Operation registered successfully');
            } catch (error) {
                console.log(error)
                req.flash('message', 'An error has ocurred, try again later.');
            }
        }
    }
    res.redirect('/dashboard/list');
}

ctrl.delete = async(req, res) => {
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
}

ctrl.modify = async(req, res) => {
    let operation = req.params.id_operation;
    
    let { concept, amount, date, category, newCategory } = req.body;

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
                (date)?await pool.query(`UPDATE expenses SET CONCEPT = '${concept}', E_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${category}' WHERE E_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = default, CATEGORY = '${category}' WHERE E_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        } else {
            try {
                (date)?await pool.query(`UPDATE income SET CONCEPT = '${concept}', I_VALUE = ${amount}, CREATED_AT = '${date}', CATEGORY = '${category}' WHERE I_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = default, CATEGORY = '${category}' WHERE I_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        }
    } else {
        if(operation.charAt(0) == 'e') {
            try {
                (date)?await pool.query(`UPDATE expenses SET CONCEPT = '${concept}', E_VALUE = ${amount}, CREATED_AT = '${date}' WHERE E_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE expenses SET E_VALUE = ${amount}, CREATED_AT = default WHERE E_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        } else {
            try {
                (date)?await pool.query(`UPDATE income SET CONCEPT = '${concept}', I_VALUE = ${amount}, CREATED_AT = '${date}' WHERE I_ID_OPERATION = ${operation.slice(1)}`):await pool.query(`UPDATE income SET I_VALUE = ${amount}, CREATED_AT = default WHERE I_ID_OPERATION = ${operation.slice(1)}`);
                req.flash('success', 'Operation updated successfully');
            } catch (err) {
                console.log(err)
                req.flash('message', 'An error has ocurred, please try again later')
            }
        }
    }

    res.redirect('/dashboard/list');
}

module.exports = ctrl;
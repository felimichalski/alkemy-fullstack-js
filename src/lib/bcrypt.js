const bcrypt = require('bcryptjs');

module.exports = {

    encryptPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },
    
    matchPassword: async (password, savedPassword) => {
        try {
            return await bcrypt.compare(password, savedPassword);
        } catch (error) {
            console.log(error)
        }
    }

};
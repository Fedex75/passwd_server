const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    auth_key: {
        type: String,
        required: true
    },
    vault: {
        type: String,
        required: true
    }
});

/*
Vault schema

{
    version: 1
    data: {
        passwords: [
            {
                name: Encrypted String
                user: Encrypted String
                password: Encrypted String
            }
        ]
    }
}
*/

module.exports = mongoose.model('User', UserSchema);
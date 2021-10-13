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
    // El token que se le pasa al cliente va a tener la forma {ID}:{HASH} donde ID es la ID del usuario
    // y HASH es una cadena aleatoria de caracteres hexadecimales que guardamos en auth_token, junto con su fecha de expiracion
    auth_token: {
      value: {
        type: String,
        default: null
      },
      expiry_date: {
        type: Date,
        default: null
      }
    },
    vault_id: {
      type: String,
      default: null
    }
});

module.exports = mongoose.model('User', UserSchema);

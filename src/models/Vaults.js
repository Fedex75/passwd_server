const mongoose = require('mongoose');

let VaultSchema = mongoose.Schema({
	version: {
		type: Number,
		required: true
	},
	data: {
		passwords: []
	}
});

/*
  Esquema de las contraseñas:
  {
    name: Hash,
    user: Hash,
    password: Hash,
	color: String
  }
*/

module.exports = mongoose.model('Vault', VaultSchema);

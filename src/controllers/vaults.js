const Vaults = require('../models/Vaults');

// Leer boveda

const getVault = async (req, res) => {
	// Buscamos la boveda
	const vault = await Vaults.findById(req.user.vault_id);
	
	res.send({
		status: 'success',
		data: vault
	}).end();
};

// Escribir boveda

const setVault = async (req, res) => {
	// Actualizamos la boveda
	await Vaults.findByIdAndUpdate(req.user.vault_id, req.body);
	
	res.send({
		status: 'success',
		data: 'NO DATA'
	}).end();
};

module.exports = {
	getVault,
	setVault
};
const Users = require('../models/Users');

const register = async (req, res) => {
	const user = new Users({
		name: req.body.name,
		email: req.body.email,
		vault: JSON.stringify({
			version: 1,
			data: {
				passwords: []
			}
		})
	});

	const error = user.validateSync();

	if (error){
		res.status(400).json({ status: 'failure', data: error.message }).end();
		return;
	} 

	const userWithSameEmail = await Users.findOne({email: req.body.email});

	if (userWithSameEmail){
		res.status(400).json({ status: 'failure', data: "Ya hay un usuario registrado con ese correo" }).end();
		return;
	}
	
	await user.save();
	res.status(200).json({ status: 'success', data: user }).end();
};

const login = async (req, res) => {
	const user = await Users.findOne({ email: req.body.email });
	let err = null;
    if (!user) {
        err = { type: 'user', msg: 'Usuario inexistente' };
    } else {
        if (user.auth_key !== req.body.auth_key) {
            err = { type: 'password', msg: 'Contraseña incorrecta' };
        }
    }
	if (err) {
		res.json({ status: 'failure', data: err }).end();
	} else {
		req.session.user_id = user._id;
		res.json(
			{
				status: 'success',
				data: {
					name: user.name,
					email: user.email,
					vault: user.vault
				}
			}
		).end();
	}
};

const logout = (req, res) => {
	req.session.destroy(() => {
		res.end();
	});
};

module.exports = {
	register,
	login,
	logout
};
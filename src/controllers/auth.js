const Users = require('../models/Users');
const Vaults = require('../models/Vaults');

// Registrar usuario

const register = async (req, res) => {
	// Creamos el documento
	const user = new Users({
		name: req.body.name,
		email: req.body.email,
		auth_key: req.body.auth_key
	});

	// Validamos el esquema
	const error = user.validateSync();

	if (error){
		res.status(400).send({ status: 'failure', data: error.message }).end();
		return;
	}

	// Verificamos que no haya otro usuario con ese correo

	const userWithSameEmail = await Users.findOne({email: req.body.email});

	if (userWithSameEmail){
		res.status(400).send({ status: 'failure', data: {type: 'email', msg: "Ya hay un usuario registrado con ese correo"}}).end();
		return;
	}

	// Si esta todo OK, creamos el documento de la boveda y lo guardamos
	let vault = new Vaults({
		version: 1,
		data: {
			passwords: []
		}
	});

	vault = await vault.save();

	// Le pasamos la ID de la boveda al user y lo guardamos
	user.vault_id = vault.id;

	await user.save();
	res.status(200).send({ status: 'success', data: 'NO DATA' }).end();
};

// Funcion auxiliar para crear el token
// Fuente: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const makeid = length => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
   return result;
}

// Iniciar sesion

const login = async (req, res) => {
	// Buscamos el usuario
	const user = await Users.findOne({ email: req.body.email });
	// Comprobamos los datos
	let err = null;
    if (!user) {
        err = { type: 'user', msg: 'Usuario inexistente' };
    } else {
        if (user.auth_key !== req.body.auth_key) {
            err = { type: 'password', msg: 'Contraseña incorrecta' };
        }
    }
	if (err) {
		res.send({ status: 'failure', data: err }).end();
		return;
	}

	// Si esta todo OK creamos el token, lo guardamos en el documento del usuario y se lo enviamos al cliente
	const token = makeid(64);

	let expiry_date = new Date();
	expiry_date.setMinutes(expiry_date.getMinutes() + 15);

	user.auth_token = {
		value: token,
		expiry_date: expiry_date
	}

	await user.save();
	res.send(
		{
			status: 'success',
			data: {
				auth_token: `${user.id}:${token}`
			}
		}
	).end();
};

// Cerrar sesion

const logout = (req, res) => {
	// Eliminamos el auth_token del usuario
	req.user.auth_token = {
		value: null,
		expiry_date: null
	}
	
	res.end();
};

// Leer informacion del usuario

const getUserInfo = (req, res) => {
	res.send(
		{
			status: 'success',
			data: {
				name: req.user.name,
				email: req.user.email,
				vault_id: req.user.vault_id
			}
		}
	).end();
};

// Middleware para rutas que requieren autenticacion
const requireLogin = async (req, res, next) => {
	let err = null;
	let user = null;
	let current_date = new Date();

	// Tomamos el token de autenticacion del header 'Authorization' y comprobamos que exista
	const auth_header = req.get('Authorization');

	if (auth_header === undefined){
		err = {
			type: 'auth_token',
			msg: 'Falta el token de autenticación'
		};
	} else {
		let [user_id, auth_token] = auth_header.split(':');

		// Buscamos el usuario, comprobamos que exista, que el token coincida y que no haya expirado
		user = await Users.findById(user_id);
		if (
			!user ||
			!user.auth_token.value ||
			user.auth_token.value !== auth_token ||
			user.auth_token.expiry_date < current_date
		){
			err = {
				type: 'auth_token',
				msg: 'Token de autenticación inválido'
			}
		}

	}

	if (err) res.status(403).send({ status: 'failure', data: err	}).end();
	else {
		req.user = user;
		next();
	}
};

module.exports = {
	register,
	login,
	logout,
	getUserInfo,
	requireLogin
};

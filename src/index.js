const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv').config();
const db = require('./config/database.js');
const authRoutes = require('./routes/auth');
const vaultsRoutes = require('./routes/vaults');
const app = express();

//Middlewares

const allowedOrigins = ['http://localhost:3000', 'https://passwd.zaifo.com.ar'];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			var msg = `The CORS policy for this site does not allow access from the specified origin (${origin}).`;
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	},
	methods: ['GET', 'POST'],
	credentials: true
}));

app.use(express.json());

//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/vaults', vaultsRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});

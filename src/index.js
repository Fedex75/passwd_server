const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv').config();
const db = require('./config/database.js');
const authRoutes = require('./routes/auth');
const vaultsRoutes = require('./routes/vaults');
const app = express();

//Middlewares

app.use(cors());

app.use(express.json());

//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/vaults', vaultsRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});

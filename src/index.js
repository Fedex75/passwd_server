const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const authRoutes = require('./routes/auth');

//TODO:
// - Use dotenv for port and mongo uri
// - Change domain to passwd.zaifo.com.ar
// - Add domain data.passwd.zaifo.com.ar that points to database
// - Change login system to random token
// - Removing CORS policy because the cookie has been replaced by token

const app = express();
const port = 8161;

//Connect to DB
mongoose.connect(`mongodb://captain_n3mo:karla%230606@${process.env.SERVER === 'production' ? 'gpass_mongodb' : 'gpass_test_mongodb'}:27017/gpass`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	if (err) console.log(err);
	else {
		console.log('Connected to DB');
	}
});

const sessionParser = session({
	secret: '51b6f824fe33844c7f1040560f2175406287a9a062161e7af8228248d3e73d40',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: {
		sameSite: 'none',
		secure: true
	}
});

//Middlewares
const allowedOrigins = ['http://localhost:3000', 'https://gpass.zaifo.com.ar', 'https://gpass.mineria.zaifo.com.ar'];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			var msg = `The CORS policy for this site does not allow access from the specified origin (${origin}).`;
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	},
	methods: ['GET', 'POST', 'PATCH'],
	credentials: true
}));
app.use(sessionParser);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
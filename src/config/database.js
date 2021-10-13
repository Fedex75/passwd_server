const mongoose = require('mongoose');

//Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	if (err) console.log(err);
	else {
		console.log('Connected to DB');
	}
});

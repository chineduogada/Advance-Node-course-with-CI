require("../models/User");

const keys = require("../config/keys");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
	.connect(keys.mongoURI, { useMongoClient: true })
	.then(() => console.log("Successfully connected to mongoDB! from test"))
	.catch((err) => console.log(err, "Failed to connect to mongoDB! form test"));


beforeAll(() => jest.setTimeout(500000));

require("../models/User");
require("../models/Blog");

const keys = require("../config/keys");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });


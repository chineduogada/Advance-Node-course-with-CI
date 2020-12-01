const { clearHash } = require("../services/cache");

const cleanCache = async (req, _res, next) => {
	await next();

	clearHash(req.user.id);
};

module.exports = cleanCache;


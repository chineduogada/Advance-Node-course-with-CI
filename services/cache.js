const mongoose = require("mongoose");
const redis = require("redis");
const { promisify } = require("util");
const keys = require("../config/keys");

// Setup REDIS
const redisUrl = keys.redisUrl;
// const client = redis.createClient(redisUrl);
const client = redis.createClient(redisUrl);
client.hget = promisify(client.hget);

// Create a `cache` prototype to mongoose Query

// Reference the Original mongoose prototypal `exec` method
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.useCache = function (options = {}) {
	this._cache = {
		hashKey: JSON.stringify(options.key || ""),
	};

	return this;
};

// Monkey-patch (hijack) the mongoose prototypal `exec` method
/**
 * @returns { Promise }
 */
mongoose.Query.prototype.exec = async function () {
	// Check for optional caching
	if (!this._cache) {
		return exec.apply(this, arguments);
	}

	// Create a unique but consistent `cache-key`
	const cacheKey = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name,
		})
	);

	// Get the already `cached-value` based off the `cache-key` from the `redis-server`
	let cacheValue = await client.hget(this._cache.hashKey, cacheKey);

	if (cacheValue) {
		cacheValue = JSON.parse(cacheValue);
		let doc;

		// We have to return query mongoose in other to get a Document;
		// eg new Blog(<filter: plain JSON>) --> new this.model(cacheValue: plain JSON)

		// If the value which was cached is an Array object. this means we must return an array on mongoose Docs
		if (Array.isArray(cacheValue)) {
			doc = cacheValue.map((d) => new this.model(d));
		} else {
			doc = new this.model(cacheValue);
		}

		console.log("SERVING FROM CACHE");

		// Have to return a mongoose Document and not a plain JSON(from cache)
		return doc;
	}

	// If there isn't no `cached-value` that means we'll to reach-out to MONGO
	const execDoc = await exec.apply(this, arguments);

	// and then set`cached-value` to `redis-server`
	client.hset(this._cache.hashKey, cacheKey, JSON.stringify(execDoc));

	console.log("SERVING FROM MONGODB");

	return execDoc;
};

module.exports = {
	clearHash: (hashKey) => {
		client.del(JSON.stringify(hashKey));
	},
};


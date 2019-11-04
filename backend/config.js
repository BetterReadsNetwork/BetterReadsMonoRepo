let config = {};
config.db = {};
// Create properties on the config.db object for the host and
// database names
config.db.host = ‘localhost:27017’;
config.db.name = ‘account’;
module.exports = config;

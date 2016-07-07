const mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports = mongoose.model('Spaceship', {name: String, serialNumber: String});

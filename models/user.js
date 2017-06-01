var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username     : { type : String, required : true, trim : true, lowercase : true },
	email        : { type : String, required : true, unique : true, lowercase : true },
	createdAt    : { type : Date, default : Date.now },
	updatedAt    : { type : Date, default : Date.now }
});

module.exports = mongoose.model('User', userSchema);
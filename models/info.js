var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var infoSchema = new mongoose.Schema({
	mobileNumber : { type : Number, required : true, trim : true, min:10},
	password     : { type : String, required : false, min: 6},
	createdAt    : { type : Date, default : Date.now },
	updatedAt    : { type : Date, default : Date.now },
	userid		 : { type : Schema.Types.ObjectId, ref : 'User'}
});

module.exports = mongoose.model('Info', infoSchema);
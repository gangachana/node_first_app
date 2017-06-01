var express = require('express');
var mongoose = require('mongoose');
var app = express();
var User = mongoose.model('User');
var Info = mongoose.model('Info');

exports.signUp = function(req, res, next) {
	req.assert('username', 'Username field can not be empty.').notEmpty();
	req.assert('email', 'Email field is invalid.').isEmail();
	req.assert('email', 'Email field can not be empty.').notEmpty();
	req.assert('mobileNumber', 'Mobile Number field can not be empty.').notEmpty();
	req.assert('mobileNumber', 'Mobile Number field Must be 10 digit.').len(10);
	req.assert('password', 'password field can not be empty.').notEmpty();
	req.assert('password', 'Password must be at least 4 characters long.').len(6);

	var errors = req.validationErrors();
	if (errors) {
		return res.send({status_code:400, status:'failure', message:errors})
	}

	var username = req.body.username;
  	var email 	 = req.body.email;
  	var password = req.body.password;
  	var mobileNumber = req.body.mobileNumber;
  	User.findOne({ email:email  }, function(err, existingUser){
  		if(err) {
  			return res.json({status_code:500, status:'failure', message:'Internal Server Error.',Error: err})
  		}
  		if(existingUser) {
  			return res.json({status_code:409 , status:'failure', message:'Account with that email address already exists.'})
  		}
  		else{
  			var newUser = new User();
  			newUser.email 	 = email;
			newUser.username = username;
			newUser.save(function(err, userCreated) {
				if (err) {
					return res.json({status_code:500, status:'failure', message:'Internal Server Error.', Error: err})
				}
				else{
					var userInfo = new Info();
					userInfo.userid = userCreated._id;
					userInfo.password = password;
					userInfo.mobileNumber = mobileNumber;
					userInfo.save(function(err, infoCreated){
						if(err){
							return res.json({status_code:500, status:'failure', message:'Internal Server Error.', Error: err})
						}
						else{
							Info.find({}).populate('userid').lean().exec(function(err, usersFound) {
						    	if(err) {
						      		return res.json({status_code:500, status:'failure', message:'Internal Server Error.',Error: err})
						    	}
						    	else {
						      		if(typeof(usersFound)!=undefined && (usersFound).length > 0) {
						         		return res.json({status_code:201, status:'success', user_info: usersFound})
						     		}
						     		else {
						      			return res.json({status_code:404, status:'failure', message:'No users found.'})
						     		}
						    	} 
						  	})
						}
					})
				}
			})
  		}
  	})
}
exports.listofusers = function(req, res, next){
	var userId = req.params.userId;
	var destoryUserId = req.params.id;
	if(typeof(userId)!=undefined && userId!=null) {
		User.find({_id:userId}).lean().exec(function(err, usersFound) {
			if(err) {
	      		return res.json({status_code:500, status:'failure', message:'Internal Server Error.',Error: err})
	    	}
	    	else {
	      		if(typeof(usersFound)!=undefined && (usersFound).length > 0) {
	         		return res.json({status_code:200, status:'success', user_info: usersFound})
	     		}
	     		else {
	      			return res.json({status_code:404, status:'failure', message:'No users found.'})
	     		}
	    	}
		})
	}
	else if(typeof(destoryUserId)!=undefined && destoryUserId!=null) {
		User.findOne({_id:destoryUserId}).exec(function(err, userFound) {
			if(err) {
				return res.json({status_code:500, status:'failure', message:'Internal Server Error.',Error: err})
			}
			else {
				if(userFound) {
					userFound.remove(function(err, results){
						if(err) {
							return res.json({status_code:500, status:'failure', message:'Internal Server Error.',Error: err})
						}
						else {
							return res.json({status_code:200, status:'success'})
						}
					})
				}
				else {
					return res.json({status_code:409, status:'failure', message:'Invalid User Id.'})
				}
			}
		})
	}
	else {
		Info.find({}).populate('userid').lean().exec(function(err, usersFound) {
	    	if(err) {
	      		return res.json({status_code:500, status:'failure', message:'Internal Server Error.',Error: err})
	    	}
	    	else {
	      		if(typeof(usersFound)!=undefined && (usersFound).length > 0) {
	         		return res.json({status_code:200, status:'success', user_info: usersFound})
	     		}
	     		else {
	      			return res.json({status_code:404, status:'failure', message:'No users found.'})
	     		}
	    	} 
	  	})
	}
}
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	id: String,
	name: String,
	token: String,
	email: String,
	photo: String,
	posts: [
		{category: String, id: String}
	]
});

var User = mongoose.model('Users', UserSchema);

User.createUser = function(newUser, callback) {
	var createUser = new User(newUser);
	createUser.save(callback);
};

User.findUserById = function(id, callback) {
	User.findOne({id: id}, callback);
}

module.exports = User;
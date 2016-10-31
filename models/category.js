var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var CategorySchema = mongoose.Schema({
	category: String,
	sub_categories: [{sub: String, name: String}],
	posts: [
		{currency: String, by_id: String, sub_category: String, desc: String, title: String, price: Number, phone: String, date: Date, name: String}
	]
});

var Category = mongoose.model('Category', CategorySchema);

Category.createCategory = function(newCategory, callback) {
	var createUser = new Category(newCategory);
	createUser.save(callback);
};

Category.findCategoryById = function(id, callback) {
	User.findOne({id: id}, callback);
}

module.exports = Category;
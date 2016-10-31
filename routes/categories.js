var express = require('express');
var router = express.Router();
var Category = require('../models/category');

router.get('/:category', function(req, res) {
	var category = req.params.category;
	Category.findOne({category: category}, function(err, category) {
		if (err) throw err;
		if (category) {
			//console.log(req.user);
			var posts = []
			if (category.posts.length <= 10)
				posts = category.posts;
			if (category.posts.length > 10) {
				for (var i = 0; i < 10; i += 1) {
					posts.push(category.posts[i]);
				}
			}
			return res.render('home', {layout: 'main', data: posts, category: category.category, user: req.user});
		}
		else
			return res.redirect('/');
	});
});



module.exports = router;
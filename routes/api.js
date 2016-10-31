var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Category = require('../models/category');
var User = require('../models/user');

router.get('/addPost', function(req, res) {
	var desc = req.query.desc;
	var price = req.query.price;
	var phone = req.query.phone;
	var date = new Date();
	var name = req.query.name;
	var title = req.query.title;
	var category = req.query.category;
	var currency = req.query.currency;
	var id = req.query.id;

	if (!name)
		name = "Unknown";

	Category.findOne({category: category}, function(err, category) {
		if (err) throw err;
		if (category) {
			category.posts.push({
				sub_category: 'all',
				by_id: id,
				desc: desc,
				price: price,
				title: title,
				phone: phone,
				date: date,
				name: name,
				currency: currency
			});

			category.save(function(err, user) {
				if (err) throw err;
				if (user)
					return res.json({status: 'SUCCESS'});
			});
		}
	});
});

router.get('/removePost', function(req, res) {
	var data = req.user;
	var id = req.query.id;

	if (data) {
		var stream = Category.find().stream();

		stream.on('data', function (doc) {
		  // do something with the mongoose document
		  //console.log(doc, 'CATEGORY::::::::::::::::::');
		  doc.posts.forEach(function(post, i) {
		  	if (post._id == id)
		  		doc.posts.splice(i,1);
		  });

		  doc.save(function(err, user) {
		  });
		}).on('error', function (err) {
		  // handle the error
		  //console.log(err);
		}).on('close', function () {
		  // the stream is closed
		  //console.log('done profile stream');
		  return res.json({status: 'SUCCESS'});
		});
	}
	else {
		return res.redirect('/');
	}
});

router.get('/getUserInfo', function(req, res) {
	var id = req.query.id;
	var my_id = req.query.myID;
	var isUser = my_id == id;

	User.findOne({id: id}, function(err, user) {
		if (err) throw err;
		return res.json({data: user, isUser: isUser});
	});
});

router.get('/getPosts', function(req, res) {
	var categoryName = req.query.category;
	var offset = req.query.offset;
	//var lastID = req.query.id;
	var returnPosts = [];
	var num_results = 10; // x-- after every result pushed to returnPosts

	Category.findOne({category: categoryName}, function(err, category) {
		category.posts.forEach(function(post, i) {
			console.log(post.title, i, offset, categoryName);
			if (i >= offset && num_results) {
				returnPosts.push(post);
				num_results -= 1;
			}
		});

		return res.json({data: returnPosts});
	});
});

module.exports = router;
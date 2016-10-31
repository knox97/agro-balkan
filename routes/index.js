var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Category = require('../models/category');
var User = require('../models/user');


// Get initial page
router.get('/', function(req, res) {
	res.render('index', {layout: 'joined'});
});


// Popular page
router.get('/profile/:id', function(req, res) {
	var data = req.user;
	var id = req.params.id;


	if (true) {
		var stream = Category.find().stream();
		var toDisplay = [];
		var profileUser;
		var isUser = false;

		
		User.findOne({id: id}, function(err, user) {
			if (err) throw err;
			profileUser = user;
			if (data && data.id == id)
		  		isUser = true;
		});

		stream.on('data', function (doc) {
		  // do something with the mongoose document
		  //console.log(doc, 'CATEGORY::::::::::::::::::');
		  doc.posts.forEach(function(post) {
		  	if (post.by_id == id)
		  		toDisplay.push(post);
		  });
		}).on('error', function (err) {
		  // handle the error
		  //console.log(err);
		}).on('close', function () {
		  // the stream is closed
		  //console.log('done profile stream');
		  //console.log(toDisplay);
		  
		  
		  return res.render('profile', {layout: 'main', user: data, profileUser: profileUser, data: toDisplay, isUser: isUser, profileID: id});
		});
	}
	else {
		return res.redirect('/category');
	}
});

router.get('/category', function(req, res) {
	var data = req.user;
	res.render('category', {layout: 'main', user: data});
});

router.get('/search/:query', function(req, res) {
	var search = req.params.query;
	var data = req.user;
	var searchResults = [];

	var stream = Category.find().stream();

	stream.on('data', function (doc) {
		// do something with the mongoose document
		//console.log(':::::::::::::::::::::', doc);
		doc.posts.forEach(function(post) {
			var title = post.title;
			var regex = new RegExp(`(${search})`, 'i');
			var match = title.match(regex);

			if (match != null)
				searchResults.push(post);
		});
	}).on('error', function (err) {
		// handle the error
		//console.log(err);
	}).on('close', function () {
		// the stream is closed
		//console.log('done profile stream');
		return res.render('search', {layout: 'main', user: data, searchResults: searchResults});
	});
});


router.get('/post/:id', function(req, res) {
	var postID = req.params.id;
	var toReturn = [];
	var stream = Category.find().stream();

	stream.on('data', function (doc) {
		// do something with the mongoose document
		//console.log(':::::::::::::::::::::', doc);
		doc.posts.forEach(function(post) {
			if (post._id == postID) {
				toReturn.push(post);
			}
		});
	}).on('error', function (err) {
		console.log(err);
	}).on('close', function () {
		return res.render('post', {layout: 'main', returnPost: toReturn[0], user: req.user});
	});

	
	
});
module.exports = router;
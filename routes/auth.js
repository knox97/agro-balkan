var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var host_url = require('../public/js/host-url.js');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({id: id}, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: '953145828123940',
    clientSecret: 'cedcf18f33228e303c1c42bd3c430235',
    callbackURL: `${host_url}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'email', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log( refreshToken, profile);
    process.nextTick(function() {
    	User.findOne({id: profile.id}, function(err, user) {
    		if (err)
    			return done(err);
    		if (user)
    			return done(null, user);
    		else {
    			var newUser = new User();
    			newUser.id = profile.id;
    			newUser.token = accessToken;
    			newUser.name = profile.displayName;
    			newUser.email = profile.emails[0].value;
    			newUser.photo = profile.photos ? profile.photos[0].value : '/img/unknown.png';
    			//console.log(newUser);
    			newUser.save(function(err, userUpdated) {
    				if (err) throw err;
    				return done(null, newUser);
    			});
    		}
    	});
    });



    /*User.findUserById(profile.id, function(err, user) {
    	if (err) throw err;
    	/*if (!user)  {
    		var newUser = {
		    	id: profile.id,
		    	name: profile.displayName,
		    	accessToken: accessToken,
		    	//email: profile.email,
		    	otherInfo: {}
		    };

		    User.createUser(newUser, function(err, user) {
		    	if (err) throw err;
		    	console.log(user);
		    });
    	}
    });    */
  }
));

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/category',
                                      failureRedirect: '/' }));

router.get('/auth/facebook/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
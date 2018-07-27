const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');


const mongoKeys = require('./config/keys')
const User = require('./models/users');

const checkAuth = require('./check-auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect(mongoKeys.dburl, function () {
	console.log("DB connnected");
})

// mongoose.connect(mongoKeys.dbrul,function(){
// 	console.log("Connected with online db")
// })

app.get('/', (req, res) => {

	res.status(200).json({

		message: 'Welcome to Home'
	})

})
app.post('/signup', (req, res) => {
	// console.log(req.body.name)
	// console.log(req.body.password);
	User.find({ email: req.body.email }).exec()
		.then(user => {
			if (user.length >= 1) {
				res.status(409).json({
					message: 'user already exist'
				})
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					console.log("Hashed password: " +hash);
					if (err) {
						res.status(500).json({
							error: err
						})
					} else {
						const aUser = new User({
							name: req.body.name,
							email: req.body.email,
							password: hash
						});

						aUser.save()
							.then(result => {
								console.log("Result: " + result);
								res.status(201).json({
									message: 'user created' + result
								})
							})
							.catch(err => {
								res.status(500).json({
									error: err
								})
							})
					}
				})
			}
		})
		.catch(err => {
			res.status(409).json({
				message: 'error during checking user in databse: ' + err
			})
		})



})

app.get('/users',checkAuth,(req, res) => {
	User.find().exec()
		.then(result => {
			res.status(201).json({
				users: result
			})
		})
		.catch(err => {
			console.log(err)
		})
})

app.post('/signin', (req, res) => {
	User.find({ email: req.body.email }).exec()
		.then(user => {
			if (user.length < 1) {
				res.status(401).json({
					message: 'User not found'
				})
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				console.log(err);
				console.log(result)
				if (err) {
					return res.status(401).json({
						message: "Auth failed"
					});
				}
				if (result) {
					const token = JWT.sign(
						{
							email: user[0].email,
							password: user[0].password
						},
						process.env.JWT_KEY,
						{
							expiresIn: "1h"
						}
						
					)
					res.status(200).json({
						message: 'User authentication granted',
						username: result.name,
						token: token
					})
				}else{
				res.status(401).json({
					message: 'password didn\'t match'	
				})
			}
			})

		})
})

app.listen(3000, () => {

	console.log("server is running on port 3000");
})

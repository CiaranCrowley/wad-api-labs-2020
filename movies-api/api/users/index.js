import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import movieModel from '../movies/movieModel'

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', (req, res) => {
	User.find().then(users =>  res.status(200).json(users));
});

// get user favourites
router.get('/:userName/favourites', (req, res, next) => {
	const userName = req.params.userName;
	User.findByUserName(userName).populate('favourites').then(
		user => res.status(201).json(user.favourites)
	).catch(next);
});

// Register OR authenticate a user
router.post('/', async (req, res, next) => {
	var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
	if (!req.body.username || !req.body.password) {
		res.status(401).json({
			success: false,
			msg: 'Please pass username and password.',
		});
	};

	if (!regex.test(req.body.password)) {
		res.status(401).json({
			success: false,
			msg: 'make sure your password is at least 5 characters long and contains at least one number and one letter,'
		});
	};

	if (req.query.action === 'register') {
		await User.create(req.body).catch(next);
		res.status(201).json({
			code: 201,
			msg: 'Successful created new user.',
		});
	} else {
		const user = await User.findByUserName(req.body.username).catch(next);
		if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (isMatch && !err) {
				// if user is found and password is right create a token
				const token = jwt.sign(user.username, process.env.SECRET);
				// return the information including token as JSON
				res.status(200).json({
					success: true,
					token: 'BEARER ' + token,
				});
			} else {
				res.status(401).json({
					code: 401,
					msg: 'Authentication failed. Wrong password.'
				});
			};
		});
	};
});

// Update a user
router.put('/:id',  (req, res) => {
	if (req.body._id) delete req.body._id;
	User.update({
		_id: req.params.id,
	}, req.body, {
		upsert: false,
	})
	.then(user => res.status(200).json({success:true,token:"FakeTokenForNow"})).catch(next);
});

// doesnt work. dont know why
router.post('/:userName/favourites', async (req, res, next) => {
	const newFavourite = req.body.id;
	const query = {username: req.params.userName};
	if (newFavourite && newFavourite.id) {
		console.log("HERE 1")
		User.find(query).then(
			user => {
				(user.favourites)?user.favourites.push(newFavourite):user.favourites =[newFavourite];
				User.findOneAndUpdate(query, {favourites:user.favourites}, {
					new: true
				}).then(user => res.status(201).send(user));
			}
		).catch((error) => next(error));
	} else {
		res.status(401).send(`Unable to find user ${req.params.userName} `)
	};

	// const userName = req.params.userName;
	// const movie = await movieModel.findByMovieDBId(newFavourite);
	// const user = await User.findByUserName(userName);
	// await user.favourites.push(movie._id);
	// await user.save();
	// res.status(201).json(user);
});

export default router;
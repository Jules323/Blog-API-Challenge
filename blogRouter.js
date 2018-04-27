const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blogs} = require('.models');

Blogs.create('TIME - what time?!?', 'Time is a never enough resource', 'JA Mitchell', '4.27.2018');
Blogs.create('The Show Must Go On', 'No matter what happens', 'JA Mitchell', '4.27.2018');



router.get('/blog-posts', (req, res) => {
	res.json(Blogs.get());
});

router.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in body request`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const entry = Blogs.create(req.body.title, req.body.content, req.body.author, req.body.date);
	res.status(201).json(entry);
});

router.put('/blog-posts/:id', jsonParser, (req, res) => {
	const requiredFields = [ 'id', 'title', 'content', 'author', 'date'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	if (req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating entry \`${req.params.id}\` `);
	Blogs.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		date: req.body.date
	});
	res.status(204).end();
});

app.delete('/blogs-posts/:id', (req, res) => {
	Blogs.delete(req.params.id);
	console.log(`Deleted blog entry \`$req.params.id}\``);
	res.status(204).end();
});

module.exports = router;







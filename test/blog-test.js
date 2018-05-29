const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('blog', function() {

	before(function() {
    return runServer();
  });

	after(function() {
    return closeServer();
  });

	it('should list items on GET', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.be.at.least(1);

				const expectedKeys = ['title', 'content', 'author'];
				res.body.forEach(function(item) {
					expect(item).to.be.a('object');
					expect(item).to.include.keys(expectedKeys);
				});
			});
	});

it('should add a blog entry on POST', function() {
	const newPost = {title:'My Blog', content: 'Life is stress.', author:'JA Mitchell'};

	return chai.request(app)
		.post('/blog-posts')
		.send(newPost)
		.then(function(res) {
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys('id', 'title', 'content', 'author');
			expect(res.body.id).to.not.equal(null);
			expect(res.body).to.be.deep.equal(Object.assign(newPost, {id: res.body.id}));
		});
});


it('should update items on PUT', function() {
	const updateData = {
		title: 'Bits',
		content: ['fee', 'fire', 'fo', 'fum']
	};
	return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			updateData.id = res.body[0].id;
			return chai.request(app)
				.put(`/blog-posts/${updateData.id}`)
				.send(updateData)
		})
		.then(function(res) {
			expect(res).to.have.status(204);
		});
});

it('should delete items on DELETE', function() {
	return chai.request(app)
	.get('/blog-posts')
	.then(function(res) {
		return chai.request(app)
			.delete(`/blog-posts/${res.body[0].id}'`);
	})
	.then(function(res) {
		expect(res).to.have.status(204);
	});
 });


})	 
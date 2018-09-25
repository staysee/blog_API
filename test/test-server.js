const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe("Blog Posts", function() {
  before(function() {
    return runServer();
  })

  after(function() {
    return closeServer();
  })

  it("should list items on GET", function() {
    return chai
      .request(app)
      .get('/blogposts');
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        //because we created 3 items on app load
        expect(res.body.length).to.be.at.least(1);
        //each item should be object with key/value pairs
        const expectedKeys = ['id', 'title', 'content', 'author'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        })
      })
  })

  it("should add an item on POST", function() {
    const newPost = {
      title: "Post Title",
      content: "This is the content of the post.",
      author: "Jane Doe"
    }
    return chai
      .request(app)
      .post('/blogposts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201)
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author');
        expect(res.body.id).to.not.equal(null);
      })
  })

  it("should update items on PUT", function() {
    const updateData = {
      title: "Title Change",
      content: "Changing post content.",
      author: "John Doe"
    };

    return (
      chai
        .request(app)
        .get('/blogposts')
        .then(function(res) {
          updateData.id = res.body[0].id;

          return chai
            .request(app)
            .put(`/blogposts/${updateData.id}`)
            .send(updateData);
        })

        .then(function(res) {
          expect(res).to.have.status(204);
        })
    )
  })

  it("should delete items on DELETE", function() {
    return (
      chai
        .request(app)
        .get('/blogposts')
        .then(function(res) {
          return chai.request(app).delete(`/blogposts/${res.body[0].id}`);
        })
        .then(function(res) {
          .expect(res).to.have.status(204);
        })
    )
  })
})

const express = require('express');
const morgan = require('morgan'); //used to log the HTTP layer
const bodyParser = require('body-parse'); //use body-parser's json() method to parse JSON data for post and put

const {BlogPosts} = require('./models');  //import BlogPosts model

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));  //log HTTP layer

//Add some posts to BlogPosts
BlogPosts.create("Hello World", "This is my first blog post! I'm learning how to create a CRUD app with Node.js", "Jane Doe")
BlogPosts.create("Food for Thought", "I have a lot of work to do...but I'm getting hungry.", "Cookie Monster")
BlogPosts.create("Christmas", "December is coming up. Let's open Santa's Workshop soon.", "Laura the Elf")


 //Routes
app.get('/blogposts', (req, res) =>{
  res.json(BlogPosts.get());
})


 app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

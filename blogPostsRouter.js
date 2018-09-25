const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser'); //use body-parser's json() method to parse JSON data for post and put
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


//Add some posts to BlogPosts
BlogPosts.create("Hello World", "This is my first blog post! I'm learning how to create a CRUD app with Node.js", "Jane Doe")
BlogPosts.create("Food for Thought", "I have a lot of work to do...but I'm getting hungry.", "Cookie Monster")
BlogPosts.create("Christmas", "December is coming up. Let's open Santa's Workshop soon.", "Laura the Elf")


//Routes
//GET
router.get('/', (req, res) =>{
  res.json(BlogPosts.get());
})

//POST
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];

  for (let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];

    if (!(field in req.body)){
      const message = `Missing \`${field}\` in request body`;

      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(
    req.body.title,
    req.body.content,
    req.body.author
  );
  res.status(201).json(item);
});

//DELETE
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);

  console.log(`Deleted recipe item \`${req.params.id}\``);
  res.status(204).end();
})

//PUT
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author'];

  for (let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];

    if (!(field in req.body)){
      const message = `Missing \`${field}\` in request body`;

      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id){
    const message = `Request path id (${req.params.id} and request body id (${req.body.id} must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating shopping list item \`${req.params.id}\``);

  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
})


module.exports = router;

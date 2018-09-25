const express = require('express');
const morgan = require('morgan'); //used to log the HTTP layer

const blogPostsRouter = require('./blogPostsRouter');
const app = express();

app.use(morgan('common'));  //log HTTP layer
app.use(express.json());

//Route requests to router
app.use('/blogposts', blogPostsRouter);


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

//creating a table (type in command line)
//sequelize model:create --name Gallery --attributes author:string,link:string,description:string


//after creating db and user, run migration in terminal sequelize db:migrate
//database is "express-gallery"
//Gallery is a table inside of it (But sequelize )
// \c express-gallery


//run this server nodemon server.js 


//SASS!!!
//npm install -D gulp gulp-connect gulp-sass;
//copy your gulp file, delete some stuff



//create a public and sass folder

//make a styles.scss file in the sass folder


//to run seeds do sequelize seed:create

var express = require('express');

var app = express();

var db = require('./models');
//db.Gallery is what you find in the models/gallery.js
var Gallery = db.Gallery;

//npm install -S body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//Tell Express which Template engine we are using by NPM module name
app.set('view engine', 'jade');

//tell express where our template files live
app.set('views', 'views');

//tells express where the public files are located
app.use(express.static('public'));

//since html5 only knows about post and get
// we use middleware which allows us to put and delete
var methodOverride = require('method-override');
app.use(methodOverride('_method'));


var morgan = require('morgan');
app.use (morgan('dev'));

//getting the delete form
app.get('/delete/:id', function (req, res) {
  var id = req.params.id;
  res.render('delete_form', {id:id});
});

//method override to delete
//test it out! localhost:8080/delete/11
app.delete('/gallery/:id', function (req, res) {
  Gallery.destroy({
    where: {
      id: req.params.id
    }
  })
  //on success redirect to the root
  .then(function (result) {
    res.redirect('/');
  });
});

//edit/put
//test it out! http://localhost:8080/delete/15
app.put('/gallery/:id', function (req, res) {
  
  var newValues = {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  };

  var query = { 
    where: {id: req.params.id},
    returning: true 
  };
  Gallery.update (newValues, query)
    .then(function (gallery) {
      res.send(gallery);
  });
});

app.delete('/', function (req, res) {
  res.send('PUT REQUEST');
});

app.post('/gallery', function (req, res) {
  Gallery.create({
    //where theres an "author" this will be the value
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  })
  .then(function (gallery) {
    res.json(gallery);
  });
});

app.get('/', function (req, res) {
  Gallery.findAll()
  .then(function (gallery) {
    //res.json(gallery);
              //this is the jade file
    res.render('gallery', {galleries: gallery});
  });
});

//this is how you render your jade file with the form!!!
app.get('/gallery/new', function (req, res) {
  res.render('new_photo', {});
});

//':' represents a variable that maps to in this case params, with the same name
//test this out by using postman, type http://localhost:8080/gallery/2
app.get('/gallery/:id', function (req, res) {
  Gallery.find({
    where: {
      id: req.params.id
    }
  })
  .then(function (gallery) {
    res.json(gallery);
  });
});



app.listen(8080, function () {
  db.sequelize.sync();
});



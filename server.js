//creating a table (type in command line)
//sequelize model:create --name Gallery --attributes author:string,link:string,description:string

//sequelize model:create --name user --attributes username:string,password:string
//sequelize db:migrate (will create the tables and columns)
//sequelize seed:create (for development, creating fake data)
//for production (property tables that has data, could be seeded, live data, mock tables would be seeded)


//after creating db and user, run migration in terminal sequelize db:migrate
//database is "express-gallery"
//Gallery is a table inside of it (But sequelize)
// \c express-gallery


//run this server nodemon server.js 


//SASS!!!
//npm install -D gulp gulp-connect gulp-sass;
//copy your gulp file, delete some stuff
//gulp



//create a public and sass folder

//make a styles.scss file in the sass folder

//to run seeds do sequelize seed:create

var express = require('express');
var app = express();
var db = require('./models');
var Gallery = db.Gallery;//db.Gallery is what you find in the models/gallery.js
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');//npm install -S body-parser
var session = require('express-session');
var CONFIG = require('./config.json');

app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'jade');//Tell Express which Template engine we are using by NPM module name
app.set('views', 'views');//tell express where our template files live
app.use(express.static('public'));//tells express where the public files are located


//since html5 only knows about post and get
// we use middleware which allows us to put and delete
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

var morgan = require('morgan');
app.use (morgan('dev'));

//configurations for cookies/sessions
app.use(session(CONFIG.SESSION));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
  function (username, password, done) {
    console.log(username, password);
    if (!authenticate(username, password)) {
      return done(null, false);//1st param (no error)...2nd param (no this wasnt good credentials, falsey failed redirect)
    }
    return done(null, {});//2nd param means (truthy successful redirect)
}));


passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

app.use(passport.initialize());

app.get('/login', function (req, res) {
  res.render('login');
});

// //should redirect to /secret if authenticated
app.post('/login', 
  passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login'
  })
);

function authenticate (username, password) {
  var CREDENTIALS = CONFIG.CREDENTIALS;
  var USERNAME = CREDENTIALS.USERNAME;
  var PASSWORD = CREDENTIALS.PASSWORD;
  return (username === USERNAME &&
          password === PASSWORD);
}

function isAuthenticated (req, res, next) {
  if (!req.isAuthenticated()) {
    return  res.redirect('/login');
  }
  return next();
}

//getting the delete form
//test it out http://localhost:8080/gallery/60/edit
app.get('/gallery/:id/edit',
  isAuthenticated,
  function (req, res) {
    var id = req.params.id;
    res.render('delete_form', {id:id});
});
//same thing just making a different path
app.get('/edit',
  isAuthenticated,
  function (req, res) {
    var id = req.params.id;
    res.render('delete_form', {id:id});
});

//method override to delete
//test it out! localhost:8080/gallery/60/edit
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


//edit/delete
//test it out! http://localhost:8080/gallery/60/edit
app.put('/gallery/:id', 
  function (req, res) {
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

app.get('/logout', function (req, res) {
  req.logout();
  res.removeHeader('Authorization');
  res.redirect('/');
});

//this is how you render your jade file with the form!!!
//also creating authentication for when you visit this page
app.get('/gallery/new',
  isAuthenticated,
  function (req, res) {
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



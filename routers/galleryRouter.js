var express = require('express');
var router = express.Router();
var isAuthenticated = require('../middleware/isAuthenticated');//2 dots (../) because it means root

var db = require('../models');
var Gallery = db.Gallery;
//this is the same as /gallery
router.route('/')
  .post(function (req, res) {
    Gallery.create(req.body)
      .then(function (result) {
        res.redirect('/gallery/'+result.id);
      });
  })
  .get(function (req, res) {
    Gallery.findAll()
      .then(function (gallery) {
        //res.json(gallery);
              //this is the jade file
      res.render('gallery', {galleries: gallery});
      });
  });

module.exports = router;
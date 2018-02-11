var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var router = express.Router();



router.param('query', function(req, res, next, query) {
  req.query = query;
  next();
});

/* GET search listing. */
router.get('/:query', function(req, res, next) {
  res.send(req.query);
});


module.exports = router;

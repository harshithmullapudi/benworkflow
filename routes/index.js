var express = require('express');
var router = express();

/* GET home page. */
router.get('/', function(req, res, next) {
 if(req.session.email)
 {
  res.redirect(['/home'])
 }
  res.render('index',{error:false});
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
    if(req.session.user.user_type === 0) {// user
      res.redirect('/admin');
    } else if(req.session.user.user_type === 1) { // admin
      res.redirect('/user');
    }
  } else {
    res.render('index', {
      title: '认证系统'
    });
  }
});

module.exports = router;

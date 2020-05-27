var express = require('express');
var UserDaoClient = require('../../dao/userdao');
var qr = require('qr-image');
var uuid = require('uuid');
var router = express.Router();

/* user index page. */
router.get('/', function(req, res, next) {
  let user = req.session.user;
  if( user && (user.user_type === 1) ){
    res.render('user/index', {
      title: '用户首页', 
      userName: user.user_name
    });
  } else {
    res.render('error', {
      message: '登录失效。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* user register page. */
router.get('/register', function(req, res, next) {
  if (req.session.user) {
    if(req.session.user.user_type === 0) {// admin
      res.redirect('/admin');
    } else if(req.session.user.user_type === 1) { // user
      res.redirect('/user');
    }
  } else {
    res.render('user/register', {
      title: '用户注册'
    });
  }
});

/* user register result. */
router.post('/register', function(req, res, next) {
  let client = new UserDaoClient();
  client.getUserByLoginName(req.body.loginName, function(rows) {
    if(rows && (rows.length > 0)) {
      res.render('error', {
        message: '账号已被注册，请重新填写。', 
        error: {
          status: '',
          stack: ''
        }
      });
    } else {
      let userObj = req.body;
      userObj.userType = 1;
      userObj.userCode = 10001;
      let longtime = new Date().getTime();
      userObj.createTime = longtime;
      userObj.modifiedTime = longtime;
      let uuidStr = uuid.v1();
      userObj.qrCode = uuidStr;
      userObj.accessToken = uuidStr;
      userObj.tokenExpired = 120 * 60 * 1000;
      // 0 apply, 1 accepted
      userObj.applyStatus = 0;
      // 0 disable, 1 enable
      userObj.status = 1;
      client.saveUserInfo(userObj, function(row) {
        console.log('insert row index : ' + row.insertId);
      });
      res.render('user/register_result', {
        title: '用户注册'
      });
    }
  });
});

/* Login page. */
router.get('/login', function(req, res, next) {
  if (req.session.user) {
    if(req.session.user.user_type === 0) {// user
      res.redirect('/admin');
    } else if(req.session.user.user_type === 1) { // admin
      res.redirect('/user');
    }
  } else {
    res.render('user/login', {
      title: '用户登录'
    });
  }
});

/* GET user login. */
router.post('/login', function(req, res, next) {
  let client = new UserDaoClient();
  client.getUserByLoginName(req.body.loginName, function(rows) {
    if(rows && (rows.length === 1)) {
      if(rows[0].password == req.body.password) {
        if(rows[0].apply_status === 0) {
          res.render('error', {
            message: '账号审核中，请联系管理员。', 
            error: {
              status: '',
              stack: ''
            }
          });
        } else {
          req.session.user = rows[0];
          if(rows[0].user_type === 0) {// user
            res.redirect('/admin');
          } else if(rows[0].user_type === 1) { // admin
            res.redirect('/user');
          }
        }
      } else {
        res.render('error', {
          message: '账号密码错误，请确认后重新登录。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    } else {
      res.render('error', {
        message: '账号输入错误, 请重新登录。', 
        error: {
          status: '',
          stack: ''
        }
      });
    }
  });
});

/* logout */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

/* GET qr page. */
router.get('/qr', function(req, res, next) {
  let user = req.session.user;
  if (user && (user.user_type === 1) ) {
    res.render('user/qr', {
      title: '电子码',
      userName: user.user_name
    });
  } else {
    res.redirect('/');
  }
});

/* GET qr image. */
router.get('/qrcode', function(req, res, next) {
  try {
    let user = req.session.user;
    let qrStr = 
      req.protocol + "://" + 
      req.hostname + ":" + 
      global.serverPort + 
      "/admin/verify?" + 
      "loginName=" + user.login_name +
      "&qrCode=" + user.qr_code;
    // create qr code from url string
    var code = qr.image(qrStr, { type: 'png' });
    res.setHeader('Content-type', 'image/png');
    //sent qr image to client side
    code.pipe(res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

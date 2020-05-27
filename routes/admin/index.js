var express = require('express');
var moment = require('moment');
var UserDaoClient = require('../../dao/userdao');
var router = express.Router();

/* user index page. */
router.get('/', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    res.render('admin/index', {
      title: '用户首页', 
      userName: user.user_name
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* user index page. */
router.get('/verify', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let loginName = req.query.loginName;
    //let qrCode = req.query.qrCode;
    let client = new UserDaoClient();
    client.getUserByLoginName(loginName, function(rows) {
      if(rows && (rows.length === 1)) {
        res.render('admin/verify', {
          title: '验证信息', 
          userId: rows[0].id,
          userName: rows[0].user_name,
          loginName: rows[0].login_name,
          userPhone: rows[0].user_phone,
          userToken: rows[0].qr_code,
          identifyCard: rows[0].identify_card,
          status: rows[0].status === 1 ? '可用' : '禁用'
        });
      } else {
        res.render('error', {
          message: '用户验证失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* accepted */
router.get('/accept', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let userObj = {};
    userObj.userId = req.query.userId;
    userObj.userName = req.query.userName, 
    userObj.loginName = req.query.loginName,
    userObj.accessDate = new Date().getTime();
    userObj.accessToken = req.query.token;
    userObj.status = req.query.status;
    let client = new UserDaoClient();
    client.saveAccessInfo(userObj, function(row) {
      console.log('am_access_log : insert row index : ' + row.insertId);
      res.redirect('/admin');
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* user list. */
router.get('/user', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let client = new UserDaoClient();
    client.getUserList(function(rows) {
      if(rows && (rows.length > 0)) {
        res.render('admin/user', {
          title: '用户列表', 
          userList: rows
        });
      } else {
        res.render('error', {
          message: '获取用户列表失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* user info. */
router.get('/user/info', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let queryLoginName = req.query.loginName;
    let client = new UserDaoClient();
    client.getUserByLoginName(queryLoginName, function(rows) {
      if(rows && (rows.length === 1)) {
        res.render('admin/user_info', {
          title: '用户信息', 
          loginName: rows[0].login_name,
          userName: rows[0].user_name,
          userSex: rows[0].user_sex,
          userPhone: rows[0].user_phone,
          identifyCard: rows[0].identify_card,
          createTime: moment(rows[0].create_time).format('YYYY-MM-DD HH:mm:ss'),
          status: rows[0].status === 0 ? '禁用' : '启用'
        });
      } else {
        res.render('error', {
          message: '获取用户信息失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* user status operation. */
router.get('/user/status', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let userObj = {};
    userObj.loginName = req.query.loginName;
    userObj.status = req.query.status;
    let client = new UserDaoClient();
    client.updateUserStatus(userObj, function(row) {
      if(row) {
        console.log('update user status : update row index : ' + row.insertId);
        res.redirect('/admin/user/info?loginName=' + userObj.loginName);
      } else {
        res.render('error', {
          message: '更新用户状态失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* apply list. */
router.get('/apply', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let client = new UserDaoClient();
    client.getApplyList(function(rows) {
      if(rows && (rows.length > 0)) {
        res.render('admin/apply', {
          title: '申请列表', 
          userList: rows
        });
      } else {
        res.render('error', {
          message: '获取申请列表失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* apply user info. */
router.get('/apply/info', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let queryLoginName = req.query.loginName;
    let client = new UserDaoClient();
    client.getUserByLoginName(queryLoginName, function(rows) {
      if(rows && (rows.length === 1)) {
        res.render('admin/apply_info', {
          title: '用户申请信息', 
          loginName: rows[0].login_name,
          userName: rows[0].user_name,
          userSex: rows[0].user_sex,
          userPhone: rows[0].user_phone,
          identifyCard: rows[0].identify_card,
          createTime: moment(rows[0].create_time).format('YYYY-MM-DD HH:mm:ss'),
          applyStatus: rows[0].apply_status === 1 ? '通过' : '申请中',
        });
      } else {
        res.render('error', {
          message: '获取用户申请信息失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* user status operation. */
router.get('/apply/status', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let userObj = {};
    userObj.loginName = req.query.loginName;
    userObj.applyStatus = 1;
    let client = new UserDaoClient();
    client.updateApplyStatus(userObj, function(row) {
      if(row) {
        console.log('update user status : update row index : ' + row.insertId);
        res.redirect('/admin/apply/info?loginName=' + userObj.loginName);
      } else {
        res.render('error', {
          message: '用户申请审核失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* access list. */
router.get('/access', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    let client = new UserDaoClient();
    client.getAccessList(function(rows) {
      if(rows && (rows.length > 0)) {
        res.render('admin/access', {
          title: '访问列表', 
          accessList: rows
        });
      } else {
        res.render('error', {
          message: '获取访问列表失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* access user info. */
router.get('/access/info', function(req, res, next) {
  let user = req.session.user;
  if(user && (user.user_type === 0)){
    var queryLoginName = req.query.loginName;
    var queryAccessDate = req.query.accessDate;
    let client = new UserDaoClient();
    client.getUserByLoginName(queryLoginName, function(rows) {
      if(rows && (rows.length === 1)) {
        res.render('admin/access_info', {
          title: '用户访问信息', 
          userName: rows[0].user_name,
          userSex: rows[0].user_sex,
          userPhone: rows[0].user_phone,
          identifyCard: rows[0].identify_card,
          createTime: moment(rows[0].create_time).format('YYYY-MM-DD HH:mm:ss'),
          accessDate: moment(Number(queryAccessDate)).format('YYYY-MM-DD HH:mm:ss'),
          status: rows[0].status === 0 ? '禁用' : '启用'
        });
      } else {
        res.render('error', {
          message: '获取用户访问信息失败。', 
          error: {
            status: '',
            stack: ''
          }
        });
      }
    });
  } else {
    res.render('error', {
      message: '登录失效，请重新登录。', 
      error: {
        status: '',
        stack: ''
      }
    });
  }
});

/* admin logout */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;

class UserDao {      
    constructor() {
        try {
            var SQLite = require('../lib/db/client');
            this.dbClient = new SQLite();
            var Xsql = require('xsql');
            this.x = new Xsql({dialect:'sqlite', schema:'main'});
        }
        catch (err) {
            throw new Error('Cannot initial `UserDao` module');
        }
    }

    query(sql, done) {
        this.dbClient.connect('./database/am.db');
        // query
        let taht  = this;
        this.dbClient.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
            }
            taht.dbClient.close();
            //console.log('close database');
            done(rows);
        });
    }

    getUserList(done) {
        var queryStr = [
            this.x.select(this.x.names(
                [
                    'id', 
                    'user_type', 
                    'user_name', 
                    'user_code', 
                    'user_phone',
                    'identify_card',
                    'login_name',
                    'password',
                    'create_time',
                    'modified_time',
                    'qr_code',
                    'apply_status',
                    'status'
                ],
                'am_user'
            )),
            this.x.from(this.x.name('am_user')),
            this.x.where([
                this.x.eq(this.x.name('user_type','am_user'), 1 ),
                this.x.eq(this.x.name('apply_status','am_user'), 1 )
            ]),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }

    getApplyList(done) {
        var queryStr = [
            this.x.select(this.x.names(
                [
                    'id', 
                    'user_type', 
                    'user_name', 
                    'user_code', 
                    'user_phone',
                    'identify_card',
                    'login_name',
                    'password',
                    'create_time',
                    'modified_time',
                    'qr_code',
                    'apply_status',
                    'status'
                ],
                'am_user'
            )),
            this.x.from(this.x.name('am_user')),
            this.x.where([
                this.x.eq(this.x.name('user_type','am_user'), 1 ),
                this.x.eq(this.x.name('apply_status','am_user'), 0 )
            ]),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }

    getUserByLoginName(loginName, done) {
        var queryStr = [
            this.x.select(this.x.names(
                [
                    'id', 
                    'user_type', 
                    'user_name', 
                    'user_sex',
                    'user_code', 
                    'user_phone',
                    'identify_card',
                    'login_name',
                    'password',
                    'create_time',
                    'modified_time',
                    'qr_code',
                    'apply_status',
                    'status'
                ],
                'am_user'
            )),
            this.x.from(this.x.name('am_user')),
            this.x.where(this.x.eq(this.x.name('login_name','am_user'), this.x.quotes(loginName) )),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }

    saveUserInfo(userObj, done) {
        var queryStr = [
            this.x.insert(
                'am_user', 
                [
                    'user_type',
                    'user_sex',
                    'user_name', 
                    'user_code', 
                    'user_phone',
                    'identify_card',
                    'login_name',
                    'password',
                    'create_time',
                    'modified_time',
                    'access_token',
                    'token_expired',
                    'qr_code',
                    'apply_status',
                    'status'
                ],
                [
                    userObj.userType, 
                    userObj.userSex, 
                    userObj.userName, 
                    userObj.userCode,
                    userObj.userPhone,
                    userObj.userIdentify,
                    userObj.loginName,
                    userObj.userPassword,
                    userObj.createTime,
                    userObj.modifiedTime,
                    userObj.accessToken,
                    userObj.tokenExpired,
                    userObj.qrCode,
                    userObj.applyStatus,
                    userObj.status
                ]
            ),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }

    updateUserStatus(userObj, done) {
        var queryStr = [
            this.x.update(
                'am_user', 
                [
                    'status'
                ],
                [
                    userObj.status
                ]
            ),
            this.x.where(this.x.eq(this.x.name('login_name','am_user'), this.x.quotes(userObj.loginName) )),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }

    updateApplyStatus(userObj, done) {
        var queryStr = [
            this.x.update(
                'am_user', 
                [
                    'apply_status'
                ],
                [
                    userObj.applyStatus
                ]
            ),
            this.x.where(this.x.eq(this.x.name('login_name','am_user'), this.x.quotes(userObj.loginName) )),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }

    saveAccessInfo(userObj, done) {
        var queryStr = [
            this.x.insert(
                'am_access_log', 
                [
                    'user_id',
                    'user_name',
                    'login_name',
                    'access_date', 
                    'access_token', 
                    'status'
                ],
                [
                    userObj.userId, 
                    userObj.userName, 
                    userObj.loginName, 
                    userObj.accessDate, 
                    userObj.accessToken,
                    userObj.status
                ]
            ),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }

    getAccessList(done) {
        var queryStr = [
            this.x.select(this.x.names(
                [
                    'id',
                    'user_id',
                    'user_name',
                    'login_name',
                    'access_date', 
                    'access_token', 
                    'status'
                ],
                'am_access_log'
            )),
            this.x.from(this.x.name('am_access_log')),
            ';'
        ].join(' ');
        console.log(queryStr);
        this.query(queryStr, function(columns) {
            done(columns);
        });
    }
}

function UserDaoClient() {
    return new UserDao();
}

exports = module.exports = UserDaoClient;

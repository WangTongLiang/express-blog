/*
 * @Author: Haitai
 * @Date:   2016-09-08 16:56:51
 * @Last Modified by:   Haitai
 * @Last Modified time: 2016-09-08 17:38:53
 */

'use strict';
var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};
module.exports = User;
//储存用户信息
User.prototype.save = function(callback) {
    //要存储数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };

    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取user集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将用户数据插入user合计
            collection.insert(user, {
                safe: true
            }, function(err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });
    });
};
//读取用户信息
User.get = function(name, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name: name
            }, function(err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    });
};

/*
 * @Author: Haitai
 * @Date:   2016-09-09 11:06:17
 * @Last Modified by:   Haitai
 * @Last Modified time: 2016-09-29 14:27:29
 */

'use strict';
var mongodb = require('./db'),
    markdown = require('markdown').markdown;

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}
module.exports = Post;
//储存一篇文章及其相关信息
Post.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    //存入数据库的文档
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    };
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts合集
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文件插入posts合集
            collection.insert(post, { safe: true }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};
//读取文章及相关信息
Post.getAll = function(name, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts合集
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //根据query对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //解析markdown位html
                docs.forEach(function(doc) {
                    doc.post = markdown.toHTML(doc.post);
                })
                callback(null, docs);
            })
        });
    })
};
//获取一篇文章
Post.getOne = function(name, day, title, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts合集
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据用户名 时间 文章名查询
            collection.findOne({
                "name": name,
                "time.day": day,
                "title": title
            }, function(err, doc) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                //解析markdown为html
                doc.post = markdown.toHTML(doc.post);
                callback(null, doc);
            });
        });
    });
};
Post.edit = function(name, day, title, callback) {
        mongodb.open(function(err, db) {
            if (err) {
                return callback(err);
            }
            db.collection('posts', function(err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.findOne({
                    "name": name,
                    "time.day": day,
                    "title": title
                }, function(err, doc) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, doc);
                })
            })
        })
    }
    //更新一篇文章
Post.update = function(name, day, title, post, callback) {
        mongodb.open(function(err, db) {
            if (err) {
                return callback(err);
            }
            db.collection('posts', function(err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.update({
                    "name": name,
                    "time.day": day,
                    "title": title
                }, {
                    $set: { post: post }
                }, function(err) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                })
            })
        })
    }
    //删除一篇文章
Post.remove = function(name, day, title, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                "name": name,
                "time.day": day,
                "title": title
            }, {
                w: 1
            }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}

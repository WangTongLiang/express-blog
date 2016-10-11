/*
 * @Author: Haitai
 * @Date:   2016-09-08 14:24:00
 * @Last Modified by:   Haitai
 * @Last Modified time: 2016-09-08 17:43:01
 */

'use strict';
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, settings.port), { safe: true });

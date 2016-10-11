var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var users = require('./routes/users');
var multer = require('multer');

var app = express();


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
    store: new MongoStore({//创建新的数据库连接
        db: settings.db,//数据库名
        host: settings.host,//数据库地址
        port: settings.port//数据库端口号
    })
}));
app.use(multer({
    dist: './public/images',
    rename: function(fieldname, filename) {
        return filename;
    }
}));
// view engine setup
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//调用index.js暴露出来的模块，把app作为参数传递过去
routes(app);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port' + app.get('port'));
});
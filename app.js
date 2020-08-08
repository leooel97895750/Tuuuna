let express = require('express');
let path = require('path');
//let favicon = require('static-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let helmet = require('helmet');
//let opay = require('opay_payment_nodejs');

let articleRouter = require('./routes/article');
let boardRouter = require('./routes/board');
let getmailhashRouter = require('./routes/getmailhash');
let sendmailRouter = require('./routes/sendmail');
let insertaccountRouter = require('./routes/insertaccount');
let loginRouter = require('./routes/login');
let getmemberRouter = require('./routes/getmember');
let updatememberimgRouter = require('./routes/updatememberimg');
let getclassboardRouter = require('./routes/getclassboard');
let getarticlelistRouter = require('./routes/getarticlelist');
let getclassRouter = require('./routes/getclass');
let getarticleRouter = require('./routes/getarticle');
let insertarticleRouter = require('./routes/insertarticle');
let insertmessageRouter = require('./routes/insertmessage');
let getmessageRouter = require('./routes/getmessage');
let insertboardRouter = require('./routes/insertboard');
let opayRouter = require('./routes/opay');
let opayretuenRouter = require('./routes/opayreturn');

let app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(opay);

app.use('/', articleRouter);
app.use('/', boardRouter);
app.use('/', getmailhashRouter);
app.use('/', sendmailRouter);
app.use('/', insertaccountRouter);
app.use('/', loginRouter);
app.use('/', getmemberRouter);
app.use('/', updatememberimgRouter);
app.use('/', getclassboardRouter);
app.use('/', getarticlelistRouter);
app.use('/', getclassRouter);
app.use('/', getarticleRouter);
app.use('/', insertarticleRouter);
app.use('/', insertmessageRouter);
app.use('/', getmessageRouter);
app.use('/', insertboardRouter);
app.use('/', opayRouter);
app.use('/', opayretuenRouter);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

'use strict';

var fs             = require('fs');
var express        = require('express');
var hbs            = require('express-hbs');
var http           = require('http');
var path           = require('path');
var url            = require('url');
var connectRedis   = require('connect-redis')(express);

var routes         = require('./routes');


var myConfig = {
    webPort:       process.env.PORT          || 3000,
    siteTitle:     process.env.SITE_TITLE    || 'My Site',
    cookieSecret:  process.env.COOKIE_SECRET || 'my secret',
    redisHost:     process.env.REDIS_HOST    || 'localhost',
    redisPort:     process.env.REDIS_PORT    || 6379,
    redisPass:     process.env.REDIS_PASS    || 'password',
    redisDB:       process.env.REDIS_DB      || 2,
};


// the express app global
var app = express();


var viewDir = 'views'; //path.join(__dirname, 'views');
var partialsDir = path.join(viewDir, 'partials');
var layoutsDir = path.join(viewDir, 'layout');
var defaultLayout = path.join(layoutsDir, 'default');

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express3({
    partialsDir: partialsDir,
    contentHelperName: 'content',
    layoutsDir: layoutsDir,
    defaultLayout: defaultLayout,
}));
app.set('view engine', 'hbs');
app.set('views', viewDir);


app.set('port', myConfig.webPort);

app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser(myConfig.cookieSecret));
app.use(express.session({
    store: new connectRedis({
        host: myConfig.redisHost,
        port: myConfig.redisPort,
        pass: myConfig.redisPass,
        db:   myConfig.redisDB
    })
}));
app.use(app.router);
routes.setRoutes(app);
app.use(function (req, res) {
    res.render('errors/404', {});
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals({
    mainTitle: myConfig.siteTitle
});


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Requires
 */
var express = require('express'),
    http = require('http');

/**
 * App init
 * */
var app             = express(),
    models          = {},
    controllers     = {};


/**
 * Variables
 * */
app.passport        = require('passport');

app.config          = require('./libs/config');
app.log             = require('./libs/log')(module);
app.utils           = require('./libs/utils');
app.mongoose        = require('./libs/mongoose')(app);
app.redis           = require('./libs/redis')(app);

console.log(app.config.get('oauth:facebook:clientID'));

/**
 * Models
 * */
models.user = require('./models/user')(app).model;


/**
 * Controllers
 * */
var UserController = require('./controllers/user');

controllers.user = new UserController(app, models);


/**
 * Inits
 * */
require('./inits/environment')(app, express);
require('./inits/extensions')(app, express);
require('./inits/middleware')(app, express);
require('./inits/passport_strategies')(app, controllers);


/**
 * Routes
 * */
require('./routes/common')(app, controllers);
require('./routes/auth')(app, controllers);


/**
 * Server
 * */
http.createServer(app).listen(app.get('port'), function () {
    app.log.info('Express server listening on port ' + app.get('port'));
});
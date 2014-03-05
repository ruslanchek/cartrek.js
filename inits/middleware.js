var path = require('path'),
    lessMiddleware = require('less-middleware');

module.exports = function(app, express){
    var RedisStore = require('connect-redis')(express);

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: app.config.get('session_secret'),
        maxAge: new Date(Date.now() + parseInt(app.config.get('session_time'))),
        store: new RedisStore({
            client: app.redis.client
        })
    }));

    app.use(app.passport.initialize());
    app.use(app.passport.session());
    app.use(app.router);

    app.use(lessMiddleware({
        dest: '/stylesheets',
        src: '/less',
        compress: (app.get('env') != 'development'),
        root: path.join(__dirname, '../public')
    }));

    app.use(express.static(path.join(__dirname, '../public')));

    /**
     * HTTP errors
     * */
    if ('development' != app.get('env')) {
        app.use(function(req, res, next){
            res.status(404);
            app.log.debug('Not found URL: %s', req.url);
            res.render('404', { code: '404' });
            return;
        });

        app.use(function(err, req, res, next){
            res.status(err.status || 500);
            app.log.error('Internal error(%d): %s', res.statusCode, err.message);
            res.render('500', { code: res.statusCode, message: err.message });
            return;
        });
    }else{
        app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
    }
};
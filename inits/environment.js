var path = require('path'),
    swig = require('swig');

module.exports = function(app, express){
    app.log.info('Current environment:', app.get('env'));

    /**
     * Environment
     * */
    app.set('port', process.env.PORT || app.config.get('port'));
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'html');

    app.engine('html', swig.renderFile);

    if(app.get('env') == 'production'){
        swig.setDefaults({ cache: true });
        app.set('view cache', true);
    }else{
        swig.setDefaults({ cache: false });
        app.set('view cache', false);
    }

    app.set('project_uri', app.config.get('protocol') + '://' + app.config.get('domain_name'));

    app.use(express.favicon());

    /**
     * Development
     * */
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    /**
     * Misc auth methods
     * */
    app.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/auth/login')
        }
    }

    app.ensureNotAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        } else {
            return next();
        }
    }
}
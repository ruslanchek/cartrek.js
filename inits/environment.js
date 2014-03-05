var path = require('path');

module.exports = function(app, express){
    app.log.info('Current environment:', app.get('env'));

    /**
     * Environment
     * */
    app.set('port', process.env.PORT || app.config.get('port'));
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');
    app.set('project_uri', app.config.get('protocol') + '://' + app.config.get('domain_name'));

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
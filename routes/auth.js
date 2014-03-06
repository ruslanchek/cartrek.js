module.exports = function (app, controllers) {
    var common = {
        utils: app.utils
    };

    /**
     * Routes for Facebook auth
     * */
    app.get('/auth/facebook', app.passport.authenticate('facebook'));

    app.get(
        '/auth/facebook/callback',
        app.passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Twitter auth
     * */
    app.get('/auth/twitter', app.passport.authenticate('twitter'));

    app.get(
        '/auth/twitter/callback',
        app.passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Google auth
     * */
    app.get('/auth/google', app.passport.authenticate('google'));

    app.get(
        '/auth/google/return',
        app.passport.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Vk auth
     * */
    app.get('/auth/vkontakte', app.passport.authenticate('vkontakte'));

    app.get(
        '/auth/vkontakte/callback',
        app.passport.authenticate('vkontakte', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Routes for Yandex auth
     * */
    app.get('/auth/yandex', app.passport.authenticate('yandex'));

    app.get('/auth/yandex/callback',
        app.passport.authenticate('yandex', { successRedirect: '/', failureRedirect: '/auth/login' })
    );


    /**
     * Route for login page
     * */
    app.get('/auth/login', app.ensureNotAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            metadata: {
                title: 'Авторизация'
            }
        });

        res.render('auth.login.html', params);
    });


    /**
     * Post for logging in
     * */
    app.post('/auth/login', function (req, res) {
        app.passport.authenticate('local', function (err, user) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'SERVER_ERROR'
                });
            }

            if (!user) {
                return res.json({
                    success: false,
                    message: 'INVALID_CREDENTIALS',
                    fields: ['username', 'password']
                });
            }

            req.login(user, {}, function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'SERVER_ERROR'
                    });
                }

                return res.json({
                    success: true,
                    message: 'OK'
                });
            });
        })(req, res, function(result){
            res.json(result);
        });
    });


    /**
     * Route for password recovery page
     * */
    app.get('/auth/password-recovery', app.ensureNotAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            metadata: {
                title: 'Восстановление пароля'
            }
        });

        res.render('auth.password-recovery.html', params);
    });


    /**
     * Route for password recovery code page
     * */
    app.get('/auth/password-recovery/:hash', app.ensureNotAuthenticated, function(req, res){
        controllers.user.passwordRecoveryCheckCode(req.params.hash, function(result){
            var params = app.utils.extend(common, {
                user: req.user,
                result: result,
                metadata: {
                    title: 'Восстановление пароля'
                }
            });

            res.render('auth.password-recovery-code.html', params);
        });
    });


    /**
     * Post for password recovery
     * */
    app.post('/auth/password-recovery', function(req, res){
        controllers.user.passwordRecovery(req.body.email, function(result){
            res.json(result);
        });
    });


    /**
     * Route for sign up page
     * */
    app.get('/auth/sign-up', app.ensureNotAuthenticated, function(req, res){
        var params = app.utils.extend(common, {
            user: req.user,
            metadata: {
                title: 'Регистрация'
            }
        });

        res.render('auth.sign-up.html', params);
    });


    /**
     * Post for sign up
     * */
    app.post('/auth/sign-up', function (req, res) {
        controllers.user.signUp(req.body.email, req.body.username, req.body.password, function(result){
            res.json(result);
        });
    });


    /**
     * Route for logging out
     * */
    app.get('/auth/logout', function (req, res) {
        req.logout();

        if (req.xhr) {
            return res.json({
                success: true
            });
        }else{
            res.redirect('/');
        }
    });
}
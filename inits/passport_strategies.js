var FacebookStrategy    = require('passport-facebook').Strategy,
    TwitterStrategy     = require('passport-twitter').Strategy,
    LocalStrategy       = require('passport-local').Strategy,
    GoogleStrategy      = require('passport-google').Strategy,
    VKStrategy          = require('passport-vkontakte').Strategy,
    YandexStrategy      = require('passport-yandex').Strategy;

module.exports = function (app, controllers) {
    /**
     * Passport inits
     * */
    app.passport.serializeUser(function (user, done) {
        return done(null, user);
    });

    app.passport.deserializeUser(function (obj, done) {
        return done(null, obj);
    });


    /**
     * Passport for Facebook init
     * */
    app.passport.use(
        new FacebookStrategy(
            {
                clientID: app.config.get('oauth:facebook:clientID'),
                clientSecret: app.config.get('oauth:facebook:clientSecret'),
                callbackURL: app.get('project_uri') + "/auth/facebook/callback"
            },
            function (accessToken, refreshToken, profile, done) {
                controllers.user.findOrCreate('facebook', profile, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    return done(null, user);
                });
            }
        )
    );


    /**
     * Passport for Twitter init
     * */
    app.passport.use(
        new TwitterStrategy(
            {
                consumerKey     : app.config.get('oauth:twitter:consumerKey'),
                consumerSecret  : app.config.get('oauth:twitter:consumerSecret'),
                callbackURL     : app.get('project_uri') + "/auth/twitter/callback"
            },
            function (token, tokenSecret, profile, done) {
                controllers.user.findOrCreate('twitter', profile, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    return done(null, user);
                });
            }
        )
    );


    /**
     * Passport for Google init
     * */
    app.passport.use(
        new GoogleStrategy(
            {
                returnURL   : app.get('project_uri') + '/auth/google/return',
                realm       : app.get('project_uri')
            },
            function (identifier, profile, done) {
                profile = app.utils.extend({id: identifier}, profile);

                controllers.user.findOrCreate('google', profile, function (err, user) {
                    return done(err, user);
                });
            }
        )
    );


    /**
     * Passport for VK init
     * */
    app.passport.use(new VKStrategy(
        {
            clientID        : app.config.get('oauth:vk:clientID'),
            clientSecret    : app.config.get('oauth:vk:clientSecret'),
            callbackURL     : app.get('project_uri') + '/auth/vkontakte/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            controllers.user.findOrCreate('vk', profile, function (err, user) {
                return done(err, user);
            });
        }
    ));


    /**
     * Passport for Yandex
     * */
    app.passport.use(
        new YandexStrategy(
            {
                clientID        : app.config.get('oauth:yandex:clientID'),
                clientSecret    : app.config.get('oauth:yandex:clientSecret'),
                callbackURL     : app.get('project_uri') + '/auth/yandex/callback'
            },
            function(accessToken, refreshToken, profile, done) {
                controllers.user.findOrCreate('yandex', profile, function (err, user) {
                    return done(err, user);
                });
            }
        )
    );


    /**
     * Passport for Local auth
     * */
    app.passport.use(
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password'
            },
            function (username, password, done) {
                controllers.user.findOne(username, password, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    return done(null, user);
                });
            }
        )
    );
}
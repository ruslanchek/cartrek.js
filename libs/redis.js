/**
 * Requires
 * */
var redis = require('redis');

module.exports = function(app){
    var redis_credentials;

    if(app.get('env') == 'development'){
        redis_credentials = {
            host: app.config.get('redis.development.host'),
            port: app.config.get('redis.development.port')
        };
    }else{
        redis_credentials = {
            host: app.config.get('redis.production.host'),
            port: app.config.get('redis.production.port')
        };
    }

    this.client = redis.createClient(redis_credentials.port, redis_credentials.host);

    return this;
}
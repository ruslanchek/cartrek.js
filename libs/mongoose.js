/**
 * Requires
 * */
var mongoose = require('mongoose');

module.exports = function(app){
    /**
     * Connect
     * */
	var link;
	
	if(app.get('env') == 'development'){
		link = app.config.get('mongoose:development');
	}else{
		link = app.config.get('mongoose:production');
	}
	
    mongoose.connect(link);

    this.db = mongoose.connection;

    this.db.on('error', function (err) {
        app.log.error('Mongoose connection error:', err.message);
    });

    this.db.once('open', function callback () {
        app.log.info("Mongoose connected to DB!");
    });

    this.Schema      = mongoose.Schema;
    this.mongoose    = mongoose;

    return this;
}

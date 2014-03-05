var crypto = require('crypto');

module.exports = function (app) {
    /**
     * Schema
     * */
    var schema = new app.mongoose.Schema({
        username: {
            type: String,
            index: true,
            unique: true,
            required: true
        },

        email: {
            type: String,
            index: true,
            unique: true,
            sparse: true
        },

        restore_date: {
            type: Date
        },

        restore_hash: {
            type: String
        },

        display_name: {
            type: String
        },

        hashed_password: {
            type: String,
            required: true
        },

        salt: {
            type: String,
            required: true
        },

        created: {
            type: Date,
            default: Date.now
        },

        twitter_id: {
            type: String,
            unique: true,
            sparse: true
        },

        facebook_id: {
            type: String,
            unique: true,
            sparse: true
        },

        google_id: {
            type: String,
            unique: true,
            sparse: true
        },

        vk_id: {
            type: String,
            unique: true,
            sparse: true
        },

        yandex_id: {
            type: String,
            unique: true,
            sparse: true
        }
    });


    /**
     * Validate
     * */
    schema.path('email').validate(function (email) {
        var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return pattern.test(email);
    }, 'PATTERN_MISSMATCH');


    /**
     * Virtual
     * */
    schema.virtual('password')
        .set(function (password) {
            this._plain_password = password;
            this.salt = crypto.randomBytes(32).toString('base64');
            //this.salt = crypto.randomBytes(128).toString('base64'); //TODO: try more secure
            this.hashed_password = this.encryptPassword(password);
        })
        .get(function () {
            return this._plain_password;
        });


    schema.virtual('userId')
        .get(function () {
            return this.id;
        });


    /**
     * Methods
     * */
    schema.methods.encryptPassword = function (password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        //return crypto.pbkdf2Sync(password, this.salt, 10000, 512); //TODO: try more secure
    };

    schema.methods.checkPassword = function (password) {
        return this.encryptPassword(password) === this.hashed_password;
    };

    this.model = app.mongoose.mongoose.model('User', schema);

    return this;
};
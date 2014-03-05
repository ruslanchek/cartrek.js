var mailer = require('express-mailer');

module.exports = function(app, express){
    if(app.get('env') == 'development'){
        mailer.extend(app, {
            transportMethod: 'SMTP',
            secureConnection: true,
            port: 465,
            host: 'smtp.gmail.com',
            from: 'no-reply@manager.cartrek.ru',
            auth: {
                user: 'ruslanchek@gmail.com',
                pass: 'gcwkjwxeebvpxwmj'
            }
        });
    } else {
        mailer.extend(app, {
            from: 'no-reply@manager.cartrek.ru',
            transportMethod: 'sendmail'
        });
    }
};
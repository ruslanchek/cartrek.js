app.auth = {
    logOut: function () {
        $.ajax({
            url: '/auth/logout',
            type: 'get',
            beforeSend: function(){
                app.loading.setGlobalLoading('logout');
            },
            success: function (data) {
                app.loading.unSetGlobalLoading('logout');

                if(data && data.success === true){
                    document.location.href = '/';
                }
            },
            error: function(){
                app.loading.unSetGlobalLoading('logout');
            }
        })
    },

    bindControls: function(){
        $('.logout').off('click').on('click', function(e){
            e.preventDefault();

            if(confirm('Выйти?')){
                app.auth.logOut();
            }
        });
    },

    init: function(){
        this.bindControls();

        new app.form.FormController({
            form_selector: '#form-login',
            url: '/auth/login',
            fields: {
                username: '#username',
                password: '#password'
            },
            messages: {
                OK: 'Успешная авторизация!'
            },
            onSuccess: function(data){
                $('.form-inputs').slideUp(200);

                setTimeout(function(){
                    location.href = '/';
                }, 1000);
            }
        });

        new app.form.FormController({
            form_selector: '#form-password-recovery',
            url: '/auth/password-recovery',
            fields: {
                email: '#email'
            },
            messages: {
                OK: 'Инструкция по восстановлению отправлена на ваш e-mail'
            },
            onSuccess: function(data){
                $('.form-inputs').slideUp(200);
            }
        });

        new app.form.FormController({
            form_selector: '#form-sign-up',
            url: '/auth/sign-up',
            fields: {
                email: '#email',
                username: '#username',
                password: '#password'
            },
            messages: {
                OK: 'Регисрация прошла успешно, теперь вы можете авторизоваться!'
            },
            onSuccess: function(data){
                $('.form-inputs').slideUp(200);
            }
        });
    }
}
app.form = {
    messages: {
        SERVER_ERROR                        : 'Ошибка сервера',

        INVALID_CREDENTIALS                 : 'Неправильные данные',

        EMAIL_EMPTY                         : 'E-mail обязателен',
        EMAIL_DOES_NOT_MATCH_PATTERN        : 'E-mail неверный',
        EMAIL_USED                          : 'E-mail уже используется',

        USERNAME_EMPTY                      : 'Имя пользователя обязателено',
        USERNAME_DOES_NOT_MATCH_PATTERN     : 'Имя &mdash; только латинские символы, цифры и дефисы',
        USERNAME_USED                       : 'Имя пользователя уже используется',

        CREDENTIALS_IS_WRONG                : 'Введен неверный пароль или логин',
        PASSWORD_EMPTY                      : 'Пароль обязателен',
        PASSWORD_DOES_NOT_MATCH_PATTERN     : 'Пароль &mdash; только латинские символы, цифры и дефисы',

        DATE_EMPTY                          : 'Не введена дата',
        DATE_DOES_NOT_MATCH_PATTERN         : 'Неправильная дата'
    },

    FormController: function(options){
        var _this = this;

        this.options = {
            setFieldError: function($field){
                $field.addClass('input-error');
            },
            unSetFieldError: function($field){
                $field.removeClass('input-error');
            },
            beforeSend: function(){},
            onSuccess: function(data){},
            onFail: function(){},

            from_modal: false,
            show_success_message: true,
            modal_controller: null,
            fields: {},
            url: '',
            form_selector: '',
            message_animation_time: 200,
            messages: {}
        };

        $.extend(this.options, options);

        this.$form = $(this.options.form_selector);

        if(this.$form.length <= 0){
            return;
        }

        this.$form.find('.form-message').hide();

        this.clearErrorsBinder = function(fields){
            $.each(fields, function(key, val){
                $(val).off('focus.ce change.ce keyup.ce').on('focus.ce change.ce keyup.ce', function(){
                    _this.options.unSetFieldError($(this));
                });
            });
        };

        this.clearErrorsBinder(this.options.fields);

        this.setFieldsErrors = function(fields){
            if(fields){
                for (var i = 0, l = fields.length; i < l; i++) {
                    this.options.setFieldError($('#' + fields[i]));
                }
            }
        };

        this.unSetFieldsErrors = function(){
            $.each(this.options.fields, function(key, val){
                _this.options.unSetFieldError($(val));
            });
        };

        this.parseServerMessage = function(message_code){
            var messages = {};

            $.extend(messages, app.form.messages, this.options.messages);

            if(messages[message_code]){
                return messages[message_code];
            } else {
                return message_code;
            }
        };

        this.setLoading = function(){
            if(this.options.from_modal === true && this.options.modal_controller){
                this.options.modal_controller.setLoading();
            }else{
                app.loading.setGlobalLoading('app.form.FormController.' + this.options.form_selector);
            }

            this.$form.find('input[type="submit"]')
                .attr('disabled', 'disabled')
                .prop('disabled', true);
        };

        this.unSetLoading = function(){
            if(this.options.from_modal === true && this.options.modal_controller){
                this.options.modal_controller.unSetLoading();
            }else{
                app.loading.unSetGlobalLoading('app.form.FormController.' + this.options.form_selector);
            }

            this.$form.find('input[type="submit"]')
                .removeAttr('disabled', 'disabled')
                .removeProp('disabled');
        };

        this.pushFormMessage = function(type, message){
            if(this.options.show_success_message !== true && (type == true || type == 'success')){
                return;
            }

            _this.dismissFormMessage(function(){
                var class_name = '';

                if(type == 'success' || type === true){
                    class_name = 'success';
                }else{
                    class_name = 'error';
                }

                _this.$form.find('.form-message')
                    .addClass(class_name)
                    .html('<a href="#" class="close icon-cancel"></a>' + _this.parseServerMessage(message))
                    .slideDown(_this.options.message_animation_time);

                _this.$form.find('.form-message .close').on('click', function(){
                    _this.$form.find('.form-message').slideUp(100);
                });
            });
        };

        this.dismissFormMessage = function(cb){
            if(this.$form.find('.form-message').is(':visible')){
                this.$form.find('.form-message').slideUp(this.options.message_animation_time, function(){
                    _this.$form.find('.form-message').removeClass('success error').empty();
                    _this.unSetFieldsErrors();
                    if(cb){
                        cb();
                    }
                });
            }else{
                _this.unSetFieldsErrors();
                
                if(cb){
                    cb();
                }
            }
        };

        this.processForm = function(){
            var send_data = {};

            for (var key in _this.options.fields) {
                if (_this.options.fields.hasOwnProperty(key)) {
                    var $field = _this.$form.find(_this.options.fields[key]);

                    if($field.attr('type') == 'checkbox'){
                        if($field.prop('checked') === true){
                            send_data[key] = 1;
                        }else{
                            send_data[key] = 0;
                        }
                    }else{
                        send_data[key] = $field.val();
                    }
                }
            }

            $.ajax({
                url: _this.options.url,
                type: 'post',
                data: send_data,
                dataType: 'json',
                beforeSend: function(){
                    _this.setLoading();
                    _this.dismissFormMessage();

                    _this.options.beforeSend();
                },
                success: function (data) {
                    data.send_data = send_data;

                    setTimeout(function(){
                        _this.unSetLoading();

                        if(data && data.success === true){
                            _this.pushFormMessage(true, data.message);
                            _this.options.onSuccess(data);
                        }else{
                            _this.pushFormMessage(false, data.message);

                            if(data.fields){
                                _this.setFieldsErrors(data.fields);
                            }

                            if(_this.options.onFail) {
                                _this.options.onFail();
                            }
                        }

                    }, _this.options.message_animation_time * 1.5);
                },
                error: function(){
                    setTimeout(function(){
                        _this.unSetLoading();
                        _this.pushFormMessage(false, 'SERVER_ERROR');

                    }, _this.options.message_animation_time * 1.5);
                }
            });
        };

        this.$form.off('submit').on('submit', function(e){
            e.preventDefault();
            _this.processForm();
        });
    }
};
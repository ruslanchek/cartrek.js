app.modal = {
    overlayDraw: function(){
        var $overlay = $('<div>').addClass('modal-overlay animation-300-easeInOutQuart');

        $('body').append($overlay);

        setTimeout(function(){
            $overlay.addClass('ready');
        }, 50);
    },

    overlayHide: function(){
        if($('.modal:visible').length > 0){
            $('.modal-overlay').removeClass('ready');

            setTimeout(function(){
                $('.modal-overlay').remove();
            }, 300);
        }
    },

    ModalController: function(options){
        this.$modal = null;
        this.opened = false;
        this.id = app.utils.makeId(16);

        this.options = {
            title: 'Title',
            content: 'Content',
            onShow: function(controller){

            },
            onClose: function(){

            },
            width: 600,
            fixed: true,
            animation_time: 300,
            draggable: true,
            scrollable: false,
            max_height: 500
        };

        $.extend(this.options, options);

        var _this = this;

        this.position = function(){
            var position = 'fixed';

            if(this.options.fixed !== true){
                position = 'absolute';
            }

            if(this.options.scrollable === true){
                this.$modal.find('.content').wrap('<div class="modal_scrollable_content"></div>');
                this.$modal.find('.modal_scrollable_content').css({
                    maxHeight: this.options.max_height
                });
            }

            this.$modal.css({
                position: position,
                width: this.options.width,
                marginLeft: -this.options.width / 2,
                marginTop: -this.$modal.height() / 2
            });

            if(this.$modal.height() > $('body').height()){
                this.$modal.css({
                    top: 0,
                    marginTop: 20,
                    marginBottom: 20
                });
            }
        };

        this.open = function(){
            this.close(function(){
                app.templates.render('modal.window.html', { title: _this.options.title, content: _this.options.content }, function(html){
                    app.modal.overlayDraw();

                    var $body = $('body');

                    _this.$modal = $(html);

                    $body.append(_this.$modal);

                    _this.position();

                    setTimeout(function(){
                        _this.$modal.addClass('ready');
                    }, 50);

                    _this.opened = true;

                    _this.options.onShow(_this);

                    if(_this.options.draggable === true){
                        setTimeout(function(){
                        _this.$modal.addClass('draggable');
                        }, _this.options.animation_time);
                        _this.$modal.draggable({
                            addClasses: false
                        });
                    }

                    $body.off('keyup.modal_' + _this.id).on('keyup.modal_' + _this.id, function(e){
                        if(e.keyCode == 27){
                            _this.close(false);
                        }
                    });

                    _this.$modal.find('.close-window').on('click', function(){
                        _this.close(false);
                    });
                });
            });
        };

        this.close = function(done){
            if(this.$modal !== null || this.opened === true){
                this.$modal.removeClass('ready draggable');

                setTimeout(function(){
                    _this.$modal.remove();
                    _this.$modal = null;
                    _this.opened = false;

                    _this.options.onClose();

                    $('body').off('keyup.modal' + _this.id);

                    if(done){
                        done();
                    }
                }, this.options.animation_time);

                app.modal.overlayHide();
            } else {
                _this.opened = false;

                if(done){
                    done();
                }
            }
        };

        this.setLoading = function(){
            this.$modal.find('.header').addClass('loading');
        };

        this.unSetLoading = function(){
            this.$modal.find('.header').removeClass('loading');
        };
    }
}
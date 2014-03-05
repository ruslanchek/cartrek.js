app.number = {
    NumberController: function (options) {
        var _this = this;

        this.id = app.utils.makeId(16);

        this.options = {
            minimum: 1,
            onChange: function(value){

            }
        };

        $.extend(this.options, options);

        this.$input = $(this.options.input_selector);

        if (this.$input.length <= 0) {
            return;
        }

        this.items = [];

        if (this.$input.length <= 0) {
            return;
        }

        this.$input.wrap('<div class="number-input"></div>');

        this.$input_wrapper = this.$input.parent();
        this.$input_wrapper.append('<div class="buttons"><a href="#" class="change-down"><i class="icon-down-dir"></i></a><a href="#" class="change-up"><i class="icon-up-dir"></i></a></div>');

        this.$up = this.$input_wrapper.find('.change-up');
        this.$down = this.$input_wrapper.find('.change-down');

        this.$down.on('click', function(e){
            var m = 1;

            if(e.shiftKey == true){
                m = 10;
            }

            _this.down(m);
            e.preventDefault();
        });

        this.$up.on('click', function(e){
            var m = 1;

            if(e.shiftKey == true){
                m = 10;
            }

            _this.up(m);
            e.preventDefault();
        });

        this.$input.on('focus.number', function(){
            _this.$input.on('keyup.number', function(e){
                var m = 1;

                if(e.shiftKey == true){
                    m = 10;
                }

                if(e.keyCode == 38 || e.keyCode == 39){
                    _this.up(m);
                }

                if(e.keyCode == 40 || e.keyCode == 37){
                    _this.down(m);
                }
            });
        });

        this.$input.on('blur.number', function(){
            _this.$input.off('keyup.number');
        });

        this.$input.on('keypress.numbervalidate', function(e){
            e = e || window.event;

            var sender = e.target || e.srcElement,
                isIE = document.all,
                pattern = /\d/;

            if (sender.tagName.toUpperCase()=='INPUT')
            {
                var keyPress = isIE ? e.keyCode : e.which;

                if (keyPress < 32 || e.altKey || e.ctrlKey){
                    return true;
                }

                var symbPress = String.fromCharCode(keyPress);

                if (!pattern.test(symbPress)){
                    return false;
                }
            }

            return true;
        });

        this.up = function(multiplier){
            var value = parseInt(this.$input.val());

            if(!value){
                value = 0;
            }

            value = value + multiplier;

            this.$input.val(value);
            this.options.onChange(value);
        };

        this.down = function(multiplier){
            var value = parseInt(this.$input.val());

            if(!value){
                value = 0;
            }

            value = value - multiplier;

            if(value < this.options.minimum){
                value = this.options.minimum;
            }

            this.$input.val(value);
            this.options.onChange(value);
        };
    }
}
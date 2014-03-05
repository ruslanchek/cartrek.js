app.datepicker = {
    DatepickerController: function (options) {
        var _this = this;

        this.id = app.utils.makeId(16);

        this.options = {

        };

        $.extend(this.options, options);

        this.$input = $(this.options.input_selector);

        if (this.$input.length <= 0) {
            return;
        }

        $(this.$input).mask("99.99.9999");

        this.opened = false;

        this.$input.wrap('<div class="date-control"></div>');
        this.$input.after('<a href="#" class="action-button datepicker-picker"><i class="icon-calendar"></i></a><div class="datepicker-widget animation-150-easeInOutQuart"></div>');
        this.$picker = this.$input.parent().find('a.datepicker-picker');
        this.$widget_container = this.$input.parent().find('.datepicker-widget');

        this.$widget_container.css({
            left: this.$picker.offset().left - this.$widget_container.offset().left + this.$picker.width() / 2
        });

        this.$widget_container.datepicker({
            onSelect: function (text, obj) {
                _this.$input.val(text);

                setTimeout(function () {
                    _this.hide();
                }, 100);
            },
            defaultDate: this.$input.val(),
            firstDay: 1,
            dateFormat: 'dd.mm.yy',
            prevText: 'Назад',
            nextText: 'Вперед',
            dayNames: [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" ],
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            dayNamesShort: [ "Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб" ],
            monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
            monthNamesShort: [ "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря" ]
        });

        this.$input.on('blur.dp keyup.dp', function () {
            _this.$widget_container.datepicker('setDate', _this.$input.val());
        });

        this.$widget_container.prepend('<i class="arrow"></i>');

        this.$picker.on('click', function (e) {
            e.preventDefault();

            if (_this.opened == true) {
                _this.hide();
            } else {
                _this.show();
            }
        });

        this.show = function () {
            this.opened = true;
            this.$widget_container.addClass('show');

            $('body').on('keyup.dp' + this.id, function (e) {
                if (e.keyCode == 27) {
                    _this.hide();
                }
            });
        }

        this.hide = function () {
            this.opened = false;
            this.$widget_container.removeClass('show');

            $('body').off('keyup.dp' + this.id);
            $('html').on('click.dp' + this.id);
        }
    }
}
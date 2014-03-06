app.ui = {
    windowSize: function(){
        $('#h-container').css({
            height: $(window).height() - $('header').height()
        });
    },

    resize: function(){
        this.windowSize();
    },

    slideScroll: function(){
        $('.slim-scroll').each(function(){
            var $self = $(this), $data = $self.data(), $slimResize;

            $self.slimScroll($data);

            $(window).resize(function(e) {
                clearTimeout($slimResize);
                $slimResize = setTimeout(function(){$self.slimScroll($data);}, 500);
            });
        });
    },

    init: function(){
        $(window).on('resize.ui', function(){
            app.ui.resize();
        });

        this.resize();
        this.slideScroll();
    }
};
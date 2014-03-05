app.loading = {
    loading_pool: {},
    global_loading_interval: null,

    unSetGlobalLoading: function (name) {
        setTimeout(function () {
            if (name && app.loading.loading_pool[name]) {
                delete(app.loading.loading_pool[name]);
            }

            var current_in_pool = 0;

            $.each(app.loading.loading_pool, function () {
                current_in_pool++;
            });

            if (current_in_pool > 0) {
                return;
            }

            $('#loading-global').animate({
                top: -5,
                opacity: 0
            }, {
                duration: 150,
                complete: function(){
                    if (app.loading.global_loading_interval) {
                        clearInterval(app.loading.global_loading_interval);
                    }
                }
            });
        }, 450);
    },

    setGlobalLoading: function (name) {
        if (name) {
            this.loading_pool[name] = true;
        }

        $('#loading-global').animate({
            top: 0,
            opacity: 1
        }, {
            duration: 150
        });
    }
}
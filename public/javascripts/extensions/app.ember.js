app.ember = {
    start: function(){
        var App = Ember.Application.create({
            LOG_TRANSITIONS: true
        });

        App.Router.map(function() {
            this.route("about", { path: "/about" });
        });

        App.IndexRoute = Ember.Route.extend({
            setupController: function(controller) {
                app.ui.init();
            }
        });
    }
};
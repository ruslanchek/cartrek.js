var app = {
    sections: {},
	chosen_options: {
		disable_search_threshold: 10,
		no_results_text: 'Не найдено',
		placeholder_text_multiple: 'Выбрать',
		placeholder_text_single: 'Выбрать',
		search_contains: true
	},

    init: function(){
        this.ember.start();
        this.ui.init();
    }
};
app.field = {
	FieldController: function ( options ) {
		var _this = this;

		this.id = app.utils.makeId(16);

		this.options = {
			input_selector: null,
			types         : []
		};

		$.extend( this.options, options );

		this.$input = $( this.options.input_selector );

		for ( var i = 0, l = this.options.types.length; i < l; i++ ) {
			var name = this.options.types[i].name, param = _this.options.types[i].param;

			switch ( name ) {
				case 'digits' :
				{
					this.$input.on( 'keypress.digits', function ( e ) {
						if( e.keyCode == 13 ){
							return true;
						}

						e = e || window.event;

						var sender = e.target || e.srcElement, isIE = document.all, pattern = /\d/;

						if ( sender.tagName.toUpperCase() == 'INPUT' ) {
							var keyPress = isIE ? e.keyCode : e.which;

							if ( keyPress < 32 || e.altKey || e.ctrlKey ) {
								return true;
							}

							var symbPress = String.fromCharCode( keyPress );

							if ( !pattern.test( symbPress ) ) {
								return false;
							}
						}

						return true;
					} );
				} break;

				case 'length' :
				{
					this.$input.on( 'keypress.length', function ( e ) {
						if( e.keyCode == 13 ){
							return true;
						}

						if ( $( this ).val().length < param ) {
							return true;
						} else {
							return false;
						}
					} );
				} break;
			}
		}
	}
};
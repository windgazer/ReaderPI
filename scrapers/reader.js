if ( typeof nl === "undefined" ) { nl = {}; }; if ( typeof nl.windgazer === "undefined" ) {  nl.windgazer = {}; };

(function ( domain ) {

	/**
	 * This is intended as a 'singleton' type class intended as global accessor for
	 * all comic-related stuff... Settings will most likely be seperately managed.
	 */
	domain.Reader = {

		request: null,

		id: null,

		entry: null,

		comic: null,

		setRequest: function ( arg ) {

			this.request = arg;

		},
		
		getRequest: function (  ) {

			return this.request;

		},

		setId: function ( arg ) {

			this.id = arg;

		},
		
		getId: function (  ) {

			return this.id;

		},

		setEntry: function ( arg ) {

			this.entry = arg;

		},
		
		getEntry: function (  ) {

			return this.entry;

		},

		setComic: function ( arg ) {

			this.comic = arg;

		},
		
		getComic: function (  ) {

			return this.comic;

		},
		
		cancelRequest: function (  ) {

			if (this.request) {

				//Cancel request
				this.request.abort();

			}
			
			this.request = null;

		}

	};

})( nl.windgazer );
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
			
			if ( History ) {

				History.storeComicId( arg.getId() );

			}

			this.comic = arg;

		},
		
		getComic: function (  ) {

			//If not comic has been set, try to retreive one from History.
			if ( !this.comic && History ) {

				var id = History.retreiveComicId();
				if ( id ) {
					this.comic = Comics.getComic( id );
				}

			}
			//If still no comic is found, retreive the first from the Comics singleton.
			if ( !this.comic ) {
				this.comic = Comics.getComics(  )[ 0 ];
			}

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

	/**
	 * Setting up the initialization routine.
	 */
	function initReader() {

		var c = domain.Reader.getComic(); 
		c.fetchLast(  );

	}
	
	ce.attachEvent( Constants.ON_AUTH_SUCCESS, initReader);
	ce.attachEvent( Constants.ON_AUTH_CANCELED, initReader);

})( nl.windgazer );
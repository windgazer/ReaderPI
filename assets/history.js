/**
 * History for use with my comic-reader. Intended to store and retreive
 * which comic was last read.
 * 
 * @author Martin 'Windgazer' Reurings
 * @fileoverview
 */
(function(){
	
	window.KEY_LASTREAD_COMIC_ID = "LastReadComic.UID"; 

	/**
	 * Storage and retreival of historical data
	 */
	var History = {

		/**
		 * Store a URL in whatever permanent storage is defined.
		 */
		storeURL: function( id, url ) {

			return Settings.setUrl( id, url );

		},

		/**
		 * Get a url from whatever permanent storage is defined.
		 * Probably will start using a caching mechanism to be able to do real-time retreival
		 * and storage, while allowing asynchronous syncing in the background without 'hurting'
		 * the user.
		 * 
		 */
		retreiveURL: function( id ) {

			return Settings.getUrl( id );

		},
		
		storeComicId: function( id ) {

			Settings.setPreference( KEY_LASTREAD_COMIC_ID, id );

		},

		/**
		 * Get the last used comic id.
		 */
		retreiveComicId: function(  ) {

			Settings.getPreference( KEY_LASTREAD_COMIC_ID );

		}

	}

	//Capture the comic-received event and store it in history. By using this pubsub system the rest of the code
	//does not need to know how history works, only that it's there to get the history from...
	ce.attachEvent( Constants.COMIC_FINISHED_LOADING, function( eid, data ) {

		if ( Options && Options.isDebug() ) console.log( "Storing new entry", data.comic.id, data.entry.getCurrentURL(  ) );

		History.storeURL( data.comic.id, data.entry.getCurrentURL(  ) );

	} );

	window.History = History;

})();

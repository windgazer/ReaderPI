/**
 * History for use with my comic-reader. Intended to store and retreive
 * which comic was last read.
 * 
 * @author Martin 'Windgazer' Reurings
 * @fileoverview
 */
(function(){

	var History = {

		storeURL: function( id, url ) {

			return Settings.setUrl( id, url );

		},
		
		retreiveURL: function( id ) {

			return Settings.getUrl( id );

		}

	}

	ce.attachEvent( nl.windgazer.COMIC_EVENT_ID, function( eid, data ) {
		
		console.log("Storing new entry", data.comic.id, data.URL);

		History.storeURL( data.comic.id, data.URL );

	} );


	window.History = History;

})();

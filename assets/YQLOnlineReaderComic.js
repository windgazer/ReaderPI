/**
 * An extension of the basic ComicReader for comics that can be 'harvested' using YQL.
 *
 * @class
 */
var YQLOnlineReaderComic = ReaderComic.extend({

	/**
	 * Constructor for the YQL Online comic reader.
	 * The sTitle, sUrl and sXpath parameters are mandatory as they are forming the core
	 * functionallity of this class.
	 * In opt you can provide some optional paramaters to augment the working of this
	 * reader. For instance the link-check method used to determine what type of link
	 * we're handling in the JSON-results
	 * 
	 * @param {String} sTitle The title of this comic, also internally used as an ID for this comic.
	 * @param {String} sUrl The URL to the latest comic, from which we can navigate further.
	 * @param {String} sXpath The xpath used to retreive the pertinent information from the pages.
	 * @param {JSON} opt A JSON Object (possibly) containing optional values.
	 * 
	 * @constructor
	 */
	init: function( sTitle, sUrl, sXpath, opt ) {
		this._super( { title: sTitle } );
		this.helper = new YQLReaderHelper( this, { url: sUrl, xpath: sXpath }, opt );
	},

	getLatestEntry: function( ) {
		Console.log("Getting latest entry!");

		var params = this.helper.getYQLParams();
		this.helper.getEntryByParams( params, this.callback, this );
	},

	getPrevEntry: function( entry ) {
		Console.log("Getting previous entry!");

		var params = this.helper.getYQLParams();
		params.url = entry.config.prev;
		if (params.url) {
			this.helper.getEntryByParams( params, this.callback, this );
		} else {
			this.callback(null);
		}
	},

	getNextEntry: function( entry ) {
		Console.log("Getting next entry!");

		var params = this.helper.getYQLParams();
		params.url = entry.config.next;
		if (params.url) {
			this.helper.getEntryByParams( params, this.callback, this );
		} else {
			this.callback(null);
		}
	},

	getEntryByHREF: function( url ) {
		Console.log("Getting entry by url for '" + url + "'");

		var params = this.helper.getYQLParams();
		params.url = url;
		this.helper.getEntryByParams( params, this.callback, this );
	}

}); 

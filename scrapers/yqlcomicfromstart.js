if ( typeof nl === "undefined" ) { nl = {}; }; if ( typeof nl.windgazer === "undefined" ) {  nl.windgazer = {}; };

( function ( domain ) {

	/**
	 * An extension of the basic YQLComic for comics that don't have a unique 'latest' comic url
	 *
	 * @class
	 */
	domain.YQLComicFromStart = domain.YQLComic.extend({
		
		/**
		 * See the description from YQLComic
		 * 
		 * @param {String} sTitle The title of this comic, also internally used as an ID for this comic.
		 * @param {String} sUrl The URL to the latest comic, from which we can navigate further.
		 * @param {String} sXpath The xpath used to retreive the pertinent information from the pages.
		 * @param {String} sUrl The URL to the first comic, from which we can navigate further.
		 * @param {JSON} opt A JSON Object (possibly) containing optional values.
		 * 
		 * @constructor
		 */
		init: function( iId, sTitle, sUrl, sXpath, startUrl, opt ) {
			this._super( iId, sTitle, sUrl, sXpath, opt );
			this.params["startUrl"] = startUrl;
		},

		/**
		 * Gets the URL for fetching the latest comic for this particular comic
		 * 
		 * @private
		 */		
		getLatestURL: function (  ) {
			
			var e = domain.Reader.getEntry();
			
			if ( e.getComic() === this ) {
				return e.getLatestURL();
			}

			return this.params.startUrl;

		},
		
		getLinksFromJSON: function( jsonLinks, context ) {
			
			var latest,
				superURLs = this._super( jsonLinks, context ),
				getLatestLink = (this.params.opt && this.params.opt.getLinkLatest)?this.params.opt.getLinkLatest:null; //This is an optional method for returning the latest link.

			if ( jsonLinks ) {

				if (jsonLinks.length > 1) {

					if ( getLatestLink ) {
						latest = getLatestLink( jsonLinks, context.URL, context.comic ).href;
					} else {
						latest = jsonLinks[2].href;
					}

				}

				if ( latest ==="#" ) {
					latest = null;
				}
				
				superURLs["latest"] = latest;

			}
			
			return superURLs;

		}
	
	}); 

} )( nl.windgazer );
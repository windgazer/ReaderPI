if ( typeof nl === "undefined" ) { nl = {}; }; if ( typeof nl.windgazer === "undefined" ) {  nl.windgazer = {}; };

( function ( domain ) {

	/**
	 * An extension of the basic ComicReader for comics that can be 'harvested' using YQL.
	 *
	 * @class
	 */
	domain.YQLComic = domain.Comic.extend({
		
		yqlQuery: "select alt, id, src, rel, href, class, title from html where url = '%URL%' and xpath='%xpath%'",
	
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
		init: function( iId, sTitle, sUrl, sXpath, opt ) {
			this._super( iId, sTitle );
			this.params = { URL: sUrl, xpath: sXpath, opt: opt };
		},

		/**
		 * @see Comic
		 */
		fetchLatest: function ( ) {

			return this.fetchByURL( this.getLatestURL(  ) );

		},

		/**
		 * @see Comic
		 */
		fetchLast: function ( ) {
			
			if ( Options.isDebug() ) console.log("Attempting to figure our what the last comic was.");
			
			var lastURL = this.getLastURL(  ) || this.getLatestURL(  );
			
			if ( Options.isDebug() ) console.log("Result of figuring out last comic is", lastURL);

			return this.fetchByURL( lastURL );

		},

		/**
		 * @see Comic
		 */
		fetchByURL: function( URL ) {
			Console.log("Getting entry by URL for '" + URL + "'");
			var uid = this.getUID(  ), c = this;
			ce.fireEvent ( Constants.COMIC_FETCH_INPROGRESS, {uid: uid, comic: c, url: URL});

			var values = {
				URL: URL,
				xpath: this.params.xpath,
				context: {
					URL: URL,
					comic: c
				}
			}
			
			var self = this;

			window.setTimeout( function() {

				domain.YQLHelper.fetchYQL( self.yqlQuery, values, self.callback );

			}, 1);

			return uid
		},

		/**
		 * Gets the URL for fetching the latest comic for this particular comic
		 * 
		 * @private
		 */		
		getLatestURL: function (  ) {

			return this.params.URL;

		},
		
		callback: function ( jsonData, context ) {

			var entry = context.comic.convertFromJSON( jsonData, context );

			if ( Options.isDebug() ) console.log("This is where we oughta call the PubSub system", entry, context, jsonData);
			context.entry = entry;

			ce.fireEvent( Constants.COMIC_EVENT_ID, context );

		},
		
		getLinksFromJSON: function( jsonLinks, context ) {
			
			var prev, next,
				isPrevLink = (this.params.opt && this.params.opt.getLinkIsPrev)?this.params.opt.getLinkIsPrev:null;

			if ( jsonLinks ) {

				if (jsonLinks.length) {

					if (isPrevLink && isPrevLink( jsonLinks[1], context.URL, context.comic, jsonLinks[0] ) ) {
						prev = jsonLinks[1].href;
						next = jsonLinks[0].href;
					} else {
						prev = jsonLinks[0].href;
						next = jsonLinks[1].href;
					}

				} else {

					//On single URL check whether it's previous or next link
					//TODO: Generalize this code so that it can work with other comics.
					var isPrev = jsonLinks.rel === "prev";
					if (isPrevLink) {
						isPrev = isPrevLink( jsonLinks, context.URL, context.comic );
					}
					if (isPrev) {
						prev = jsonLinks.href
					} else {
						next = jsonLinks.href
					}

				}

			}
			
			if (prev ==="#") {
				prev = null;
			}
			
			if (next ==="#") {
				next = null;
			}
			
			return { prev: prev, next: next };

		},
		
		convertFromJSON: function( jsonData, context ) {

			var next 	= null,
				prev 	= null,
				latest	= null,
				title 	= null,
				img 	= null;
			
			try {

				if (jsonData.query.count > 0) {
	
					var links = this.getLinksFromJSON ( jsonData.query.results["a"], context ),
						url = this.params["URL"];
					
					prev   = links.prev;
					next   = links.next;
					latest = links.latest;
					
					//To facilitate somewhat more 'rough' xpath results, checking for image array
					//and picking only the first
			
					if (jsonData.query.results["img"].length) {
						img = jsonData.query.results.img[0].src
					} else {
						img = jsonData.query.results.img.src;
					}

					//Prepender
					if (prev && prev.length < url.length) prev = url + prev;
					if (next && next.length < url.length) next = url + next;
					if (latest && latest.length < url.length) latest = url + latest;
					if (img && img.length < url.length) {
						img = url + img;
					} else if ( !img ) {
						throw "No img in result!!";
					}
		
					title = jsonData.query.results.img.alt;

				}

				//latestURL is optional
				var entry = new domain.Entry({
					"title"      :title,
					"imgURL"     :img,
					"currentURL" :context.URL,
					"prevURL"    :prev,
					"nextURL"    :next,
					"comic"      :context.comic,
					"latestURL"  :latest
				})
				
				ce.fireEvent( Constants.COMIC_ENTRY_PARSED, { msg:"Parsing from JSON finished", entry: entry, context: context } );

				return entry;
	
			} catch ( e ) {

				console.error( JSON.stringify( e ) );
				ce.fireEvent( Constants.COMIC_FETCH_FAILED, { msg:"Failed to parse / convert from JSON to Entry", exception:e, data:jsonData, context: context } );

			}
			
			return null;

		}
	
	}); 

} )( nl.windgazer );
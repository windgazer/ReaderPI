/**
 * A Helper class to obtain the links/images of the PVP Online Comic for my 'ComicReader' application.
 * My intention is to make this class more generic so that simply providing a set of YQL queries will
 * allow me to add more comics (should make it easy to rapidly add more comics).
 * 
 * @class
 * @constructor
 * @argument {Object} settings A JSON-Object containing the important bits and pieces ;)
 */
 
function YQLReaderHelper( comic, settings, opt ) {
	this.comic = comic;
	this.settings = settings;
	this.opt = opt;
}

YQLReaderHelper.prototype = {

	DATE_YEAR:1,
	DATE_MONTH:3,
	DATE_DAY:7,

	/**
	 * Get the URL and XPath for which to fetch the image/link-list. Used externally to allow
	 * for manipulation before sending the actual query.
	 */
	getYQLParams:function() {
		var url = this.settings["url"];
		var xpath = this.settings["xpath"];
		return {"url":url,"xpath":xpath};
	},

	/**
	 * Construct a YQL query to obtain the img information for a certain set of parameters.
	 * The 'params' parameter is expected to be a JSON construct of {"url":url,"xpath":xpath},
	 * where the xpath may be null (although this would result in a huge resultset...
	 * 
	 * @param {Object} params a JSON construct of {"url":url,"xpath":xpath}
	 */
	getIMGYQLQuery:function(params) {
		var yql = "select alt, id, src, rel, href, class, title from html where url = '" + params.url + "'";
		if (params.xpath) {
			yql += " and xpath='";
			yql += params.xpath;
			yql += "'";
		}
		return yql;
	},

	/**
	 * Construct a URL for fetching the result of a yql query. Currently hard-coded to return a JSON
	 * result-set passed to the 'callback' method. An eval of the resultText should result in it calling
	 * the function 'callback' with the JSON resultset as its' parameter.
	 * 
	 * @param {String} yql A YQL query
	 */
	getYQLURL:function(yql) {
		return "http://query.yahooapis.com/v1/public/yql?q=" + escape(yql) + "&format=json&callback=callback";
	},

	/**
	 * Converts a single result to a ComicEntry. Format of the data is rather strict.
	 */
	convertJSON2Entry:function(jsonData, url, comic){
		var next = null;
		var prev = null;
		if (jsonData.query.results["a"]) {
			if (jsonData.query.results["a"].length) {
				prev = jsonData.query.results["a"][0].href;
				next = jsonData.query.results["a"][1].href;
			} else {
				//On single URL check whether it's previous or next link
				//TODO: Generalize this code so that it can work with other comics.
				var isPrev = jsonData.query.results["a"].rel === "prev";
				if (this.opt && this.opt.getLinkIsPrev) {
					isPrev = this.opt.getLinkIsPrev( jsonData.query.results["a"], jsonData, url, comic );
				}
				if (isPrev) {
					prev = jsonData.query.results["a"].href
				} else {
					next = jsonData.query.results["a"].href
				}
			}
		}
		
		//Prepender
		if (prev && prev.length < this.settings["url"].length) prev = this.settings["url"] + prev;
		if (next && next.length < this.settings["url"].length) next = this.settings["url"] + next;

		//To facilitate somewhat more 'rough' xpath results, checking for image array
		//and picking only the first
		var img = null;

		if (jsonData.query.results["img"].length) {
			img = jsonData.query.results.img[0].src
		} else {
			img = jsonData.query.results.img.src;
		}

		return new ComicEntry({
			"title":jsonData.query.results.img.alt,
			"img":img,
			"href":url,
			"next":next,
			"prev":prev,
			"comic":comic
		}, this.opt);
	},

	/**
	 * Pad number 'n' with leading zero's to a length of at least 'l'.
	 * 
	 * @private
	 */
	pad:function(n, l) {
		//Setting up extra zero's.
		var bw = ( 1 << ( l - 1 ) ).toString( 2 );
		//Picking lowest number to prevent from taking of too many.
		var sn = Math.min(n.toString().length,l);
		//Adding padding zeroes and actual value, substringing to desired length.
		return (bw + n).substr(sn);
	},

	/**
	 * Fetch an entry using the gathered parameters and returning it to the
	 * callback;
	 */
	getEntryByParams:function( params, callback ) {
		var yql = this.getIMGYQLQuery( params );
		var url = this.getYQLURL( yql );
		Console.log(yql);
		var self = this;
		AJAXHelper.getData(url, function(jsonData) {
			if (jsonData) {
				Console.log(jsonData);
				var entry = self.convertJSON2Entry(jsonData, params.url, self.comic);
				Console.log(entry);
				callback(entry);
			} else {
				callback(null);
			}
		});
	}

};

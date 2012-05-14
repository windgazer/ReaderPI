if ( typeof nl === "undefined" ) { nl = {}; }; if ( typeof nl.windgazer === "undefined" ) {  nl.windgazer = {}; };

( function( domain ) {

	/**
	 * A cheap XmlHttpRequest proxy that has an 'abort' method to call of the query.
	 * This by no means cancels the actual query but should keep it's returned information
	 * from getting parsed.
	 * 
	 */
	var YQLRequest = Class.extend({
		init: function( scriptNode, cb, context ) {

			this.node = scriptNode;
			this.cb = cb;
			this.context = context;

		},
		abort: function(  ) {

			this.node.parentNode.removeChild(this.node);
			//Could call the 'callback' method??
			//window[this.cb](null, this.context);
			//Could remove the temporarily created callback?
			delete window[this.cb];

		}
	});

	/**
	 * A singleton class containing methods to assist in creating and running YQL
	 * queries.
	 */
	domain.YQLHelper = {
		
		cuid: 0,

		tagRE : /%([^%]+)%/g,

		yqlURL : "http://query.yahooapis.com/v1/public/yql?",
		
		yqlBody : "q=%query%&format=json&callback=%callback%",

		getUID: function (  ) {
			return this.cuid++;
		},

		/**
		 * This method will take an input string possibly containing 'tags', a regular expression
		 * to match against the tags and a key-value map to replace the tags with. The first capture
		 * group in the regular expression is expected to match a key in the values map.
		 * For instance if the input string contains tags in the form of %key%, the regular expression
		 * would read /%([^%])%/g. The value for key would be retrieved from the values map and the
		 * entire tag replaced with this value.
		 * 
		 * @argument {String} inp The input string with tags in it.
		 * @argument {RegExp} re The regular expression to match the tags.
		 * @argument {Map<String,String>} values The map of key-value pairs to replace the tags with.
		 * 
		 * @return String The input string only with the tags replaced by their values.
		 */
		untag : function(inp, re, values) {
			var o = "",
			    m = null,
			    preIndex = 0;
			while (m = re.exec(inp)) {
			  o += RegExp.leftContext.substr(preIndex) + values[m[1]];
			  preIndex = re.lastIndex;
			}
			o += RegExp.rightContext;
			return o;
		},

		/**
		 * This method will use a JSONP call to retreive a query from YQL. The query provided to this method
		 * may contain 'tags' which will then be replaced by their associated 'values' from the values 
		 * parameter. The callback method will be called with the return JSON code from the YQL services.
		 * The values paramater can also contain one special value named 'context'. If this value exists it will
		 * be passed along to the callback method. It may contain any type of information you want, it will
		 * not be processed, serialised or anything of the sort, it will just be passed along...
		 * 
		 * @argument {String} The YQL query.
		 * @argument {Map<String,String>} A 'set' of values.
		 * @argument {function} A callback method to call after YQL return the values.
		 */		
		fetchYQL : function( query, values, callback ) {

			var q = encodeURIComponent(this.untag( query, this.tagRE, values ));
			
			var cb = "c" + this.getUID();

			//Using JSONP to it's limit, also known as the poor man's AJAX ;)
			window[cb] = function( data ) {
				if ( Options.isDebug() ) console.log("Calling callback method", cb, data);
				callback( data, values.context );
			}
			
			var url = this.yqlURL + this.untag( this.yqlBody, this.tagRE, { query:q, callback: cb } );
			
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = url;
			
			if ( Options.isDebug() ) console.debug( query );
			if ( Options.isDebug() ) console.debug( values );
			if ( Options.isDebug() ) console.debug( url );
			
			document.documentElement.appendChild( script );
			
			return new YQLRequest( script, cb );

		}

	}

} )( nl.windgazer );
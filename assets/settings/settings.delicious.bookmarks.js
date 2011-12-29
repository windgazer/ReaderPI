/**
 * In this file I'm attempting to create an easy to use JS API against the Delicious Bookmarks service. My intention is to use this API in order to
 * store the last-read comics for my HTML5 ComicReader application.
 * 
 * @fileoverview
 */

/**
 * This is a singleton type class for using the Delicious API. The reason that it's a singleton
 * is because you have to authenticate against the Delicious service in order to make use of the
 * service, as it stands that makes the API single-user and essentially single-threaded.
 * 
 * @class
 */
var DeliciousAPI = {
	
	tagRE : /%([^%]+)%/g,
	
	auth : false,
	
	tag : "HTML5ComicReaderTest",
	
	URL : {
		bookmark : "https://%user%:%pwd%@api.del.icio.us/v1/posts/add?url=%option%&description=%option2%&tags=%tag%,%option3%&shared=no",
		readmark : "https://%user%:%pwd%@api.del.icio.us/v1/posts/get?tag=%tag%+%option%",
		deletemark : "https://%user%:%pwd%@api.del.icio.us/v1/posts/delete?url=%option%",
		labels : "https://%user%:%pwd%@api.del.icio.us/v1/tags/get",
		authenticate : "https://%user%:%pwd%@api.del.icio.us/v1/posts/get?tag=%tag%",
		yql : "http://query.yahooapis.com/v1/public/yql?"
	},
	
	yqlBody : "q=%query%&format=json&callback=callback",

	yqlQuery : "select * from xml where url='%url%'",
	
	isAuthenticated : function() {
		return ( this.auth !== false );
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
	 * This method preps the url by 'untagging' the values in the string with the values
	 * in the 'values' JSON Object. The 'user' and 'pwd' values will be retrieved from
	 * the internal auth object (if it exists).
	 * Since we need to resend the username and password on every request this method
	 * uses a POST instead of a GET request. Doubling that up with an https connection
	 * should prevent at least casual snooping from easily picking up the auth params.
	 * 
	 * @argument {String} url The URL from which to fetch the data.
	 * @argument {JSON} values A key-value pair object with replacement values.
	 */	
	get : function (url, values) {
		
		if ( this.auth!==false ) {
			values["user"] = this.auth.user;
			values["pwd"] = this.auth.pwd;
		}
		
		if ( !values["tag"] ) {
			values["tag"] = this.tag;
		}
		
		var urlOut = this.untag( url, this.tagRE, values );
		
		Console.log( urlOut );
		
		values["url"] = escape( urlOut ).replace( /\+/g, "%2B" );

		values["query"] = this.untag(this.yqlQuery, this.tagRE, values);
		
		var postBody = this.untag(this.yqlBody, this.tagRE, values);

		var result = null;
		AJAXHelper.getData( this.URL.yql, function(json){ result = json; }, false, postBody );
		
		return result;

	},

	// select * from xml where url='https://Windgazer:D)d0xl@api.del.icio.us/v1/posts/get?tag=HTML5ComicReader'
	//callback({"query":{"count":1,"created":"2011-11-06T23:50:46Z","lang":"en-US","results":{"result":{"code":"access denied"}}}});
	//callback({"query":{"count":1,"created":"2011-11-06T23:50:45Z","lang":"en-US","results":
	// {"posts":
	//   { "bookmark_key":"ZTuELE2xxt2BXsW2zs5al_kKdO_TKB0jr8S53sJh0Uw="
	//    ,"dt":"2011-11-06"
	//    ,"inbox_key":"ocUnA_kp3LKZtAcj8IwQj9NUx9fgZOsKTpm7nT2TXLk="
	//    ,"network_key":"L6CqcTEUnGyipbN6A6oCsM6AS_I_M-wc4oBotMLvoEE="
	//    ,"tags":"HTML5ComicReaderTest"
	//    ,"user":"windgazer"
	//    ,"post":{"description":"ComicReader Test Description.","extended":"","hash":"b145c37e7dc2affd1734b65e34f88571","href":"http://dodo.com/","private":"no","shared":"yes","tag":"HTML5ComicReaderTest ComicReader Test URL","time":"2011-11-06T23:48:36Z"}}}}});
	//callback({"query":{"count":1,"created":"2011-11-07T00:08:04Z","lang":"en-US","results":
	// {"result":
	//    { "bookmark_key":"ZTuELE2xxt2BXsW2zs5al_kKdO_TKB0jr8S53sJh0Uw="
	//     ,"code":"no bookmarks"
	//     ,"inbox_key":"ocUnA_kp3LKZtAcj8IwQj9NUx9fgZOsKTpm7nT2TXLk="
	//     ,"network_key":"L6CqcTEUnGyipbN6A6oCsM6AS_I_M-wc4oBotMLvoEE="
	//     ,"user":"windgazer"
	//    }
	// }}});
	//callback({"query":{"count":1,"created":"2011-11-07T18:22:28Z","lang":"en-US","results":
	// {"posts":
	//   { "bookmark_key":"ZTuELE2xxt2BXsW2zs5al_kKdO_TKB0jr8S53sJh0Uw="
	//    ,"dt":"2011-11-07"
	//    ,"inbox_key":"ocUnA_kp3LKZtAcj8IwQj9NUx9fgZOsKTpm7nT2TXLk="
	//    ,"network_key":"L6CqcTEUnGyipbN6A6oCsM6AS_I_M-wc4oBotMLvoEE="
	//    ,"tags":"HTML5ComicReaderTest"
	//    ,"user":"windgazer"
	//    ,"post":{"description":"ComicReader Test Description.","extended":"","hash":"b145c37e7dc2affd1734b65e34f88571","href":"http://dodo.com/","private":"no","shared":"yes","tag":"HTML5ComicReaderTest ComicReader Test URL","time":"2011-11-07T00:20:13Z"}}}}});
	//callback({"query":{"count":0,"created":"2011-11-07T20:42:06Z","lang":"en-US","results":null}});
	/**
	 * Authenticate to the remote service, synchronised call.
	 * This particular implementation just attempts to grab some random data, if succesful the supplied
	 * credentials are valid for re-use.
	 */
	authenticate : function (user, pwd) {

		//Failed auth attempt negates any previous credentials.
		//Also, this prevents the 'get' method from using existing creds...
		this.auth = false;

		//Setup values/options/parameters required for the YQL call.
		var values = {
			user : user,
			pwd : pwd,
			tag : DeliciousAPI.tag
		}
		
		var result = this.get(this.URL.authenticate, values)
			, results = result["query"]["results"]
			, authUser = user.toLowerCase();

		if ( results !== null && typeof results !== 'undefined' ) {

			var container = results["posts"] || results["result"];
			authUser = container["user"];

		}
		
		var authenticated = results === null || ( ( authUser === null||typeof authUser === 'undefined' ) ? false : authUser.toLowerCase() === user.toLowerCase() );
		
		if (authenticated) {
			//Cache credentials, yes, I know, this is a little unsafe on a public machine...
			this.auth = {user:authUser,pwd:pwd};
		}
		
		return authenticated;
	},

	//select * from xml where url='https://Windgazer:D)d0xl@api.del.icio.us/v1/posts/get?tag=dodo'
	//callback({"query":{"count":1,"created":"2011-11-07T18:22:29Z","lang":"en-US","results":
	// {"tags":{"tag":
	//   [
	//     {"count":"1","tag":"ComicReader Test URL"}
	//    ,{"count":"1","tag":"HTML5ComicReaderTest"}
	//   ]
	//  }}}});
	/**
	 * Grab a list of all known labels from the remote service.
	 */
	getLabels : function () {
		var results = this.get( this.URL.labels, {} );
		var out = [];
		if (results["query"]["results"]["tags"]) {
			var tags = results["query"]["results"]["tags"]["tag"];
			for (var i = 0; i < tags.length; i++) {
				out[i] = tags[i]["tag"];
			}
		}
		return out;
	},

	// select * from xml where url='https://Windgazer:D)d0xl@api.del.icio.us/v1/posts/add?&url=http://test.ca.se&description=Just+a+test&tags=HTML5ComicReader&shared=no'
	// https://api.del.icio.us/v1/posts/add?&url=http://test.ca.se&description=Just+a+test&tags=HTML5ComicReader
	//callback({"query":{"count":1,"created":"2011-11-07T00:20:13Z","lang":"en-US","results":{"result":{"code":"done"}}}});
	/**
	 * Create a new url on the remote service matched to an 'id'.
	 */
	createBookmark : function ( bookmark ) {
		var values = {
			option : escape( bookmark.getUrl() ),
			option2 : escape( bookmark.getTitle() ),
			option3 : escape( bookmark.getId() )
		}
		var result = this.get( this.URL.bookmark, values );
		return result["query"]["results"]["result"]["code"]==="done";
	},

	//callback({"query":{"count":1,"created":"2011-11-07T22:58:18Z","lang":"en-US","results":
	// {"posts":
	//  { "bookmark_key":"ZTuELE2xxt2BXsW2zs5al_kKdO_TKB0jr8S53sJh0Uw="
	//   ,"dt":"2011-11-07"
	//   ,"inbox_key":"ocUnA_kp3LKZtAcj8IwQj9NUx9fgZOsKTpm7nT2TXLk="
	//   ,"network_key":"L6CqcTEUnGyipbN6A6oCsM6AS_I_M-wc4oBotMLvoEE="
	//   ,"tags":"HTML5ComicReaderTest ComicReader-Test-URL"
	//   ,"user":"windgazer"
	//   ,"post":
	//     { "description":"ComicReader Test Title."
	//      ,"extended":""
	//      ,"hash":"b145c37e7dc2affd1734b65e34f88571"
	//      ,"href":"http://dodo.com/"
	//      ,"private":"yes"
	//      ,"shared":"no"
	//      ,"tag":"HTML5ComicReaderTest ComicReader-Test-URL"
	//      ,"time":"2011-11-07T22:58:16Z"}}}}});
	//
	//callback({"query":{"count":1,"created":"2011-11-08T23:54:32Z","lang":"en-US","results":
	//   {"result":{"bookmark_key":"ZTuELE2xxt2BXsW2zs5al_kKdO_TKB0jr8S53sJh0Uw=","code":"no bookmarks","inbox_key":"ocUnA_kp3LKZtAcj8IwQj9NUx9fgZOsKTpm7nT2TXLk=","network_key":"L6CqcTEUnGyipbN6A6oCsM6AS_I_M-wc4oBotMLvoEE=","user":"windgazer"}}}});
	//callback({"query":{"count":0,"created":"2011-11-08T23:58:36Z","lang":"en-US","results":null}});
	/**
	 * Retrieve bookmarks based on an 'id'.
	 */
	retrieveBookmark : function ( id ) {
		var values = {
			option : escape( id )
		}
		var results = this.get( this.URL.readmark, values );

		if (results["query"]["results"]===null || results["query"]["results"]["result"]) { //No bookmark found...
			return null;
		}

		var posts = results["query"]["results"]["posts"]["post"];
		var out = {};
		
		if (posts.length) {
			for (var i = 0; i < posts.length; i++) {
				var bm = new DeliciousBookmark(id);
				bm.fill(posts[i]);
				out[i] = bm;
			}
		} else {
			var bm = new DeliciousBookmark(id);
			bm.fill(posts);
			out[0] = bm;
		}
		
		return out;
	},
	
	deleteBookmark : function ( bookmark ) {
		var values = {
			option : escape( bookmark.getUrl() )
		}
		var result = this.get( this.URL.deletemark, values );
		return result["query"]["results"]["result"]["code"]==="done";
	}

};

/**
 * A JavaScript Class representing a delicious bookmark. Not nearly all of the available fields are
 * represented, that is to keep the use of the class simple, most of the available fields are
 * overkill for use in generic use-cases.
 * 
 * @class
 */
var DeliciousBookmark = Class.extend({

	/**
	 * Construct a new DeliciousBookmark, this class is considdered immutable so make sure you
	 * fill in all the required parameters ;)
	 * In the future I might provide setters for fields that can be edited, for instance the url
	 * field is immutable in the Delicious service, to alter it you'd have to destroy the
	 * existing entry and create a new one...
	 * As my immediate requirements do not nessecitate any editing of bookmarks (except for the url
	 * actually), the entire class is considdered immutable for now.
	 * 
	 * @constructor
	 * @argument {String} url The url for this bookmark (is immutable in google service)
	 * @argument {String} title The title of this bookmark.
	 * @argument {Array} labels An Array of labels, can also be a comma-separated list.
	 * @argument {String} description The desciption of this bookmark.
	 */
	init : function ( id, url, title, labels, description ) {

		this.id = id;
		this.url = url;
		this.title = title;
		if ( labels!==null && typeof labels !== "undefined" ) {
			this.labels = labels.length?labels:labels.split(/, ?/);
		} else {
			this.labels = [];
		}
		this.description = description;

	},

	/**
	 * Cheating the 'immutable' principle a little bit, this will allow me to fill a bookmark with
	 * the 'post' value resulting form 
	 */
	fill : function ( post ) {
		this.url = post.href;
		this.title = post.description;
		this.labels = post.tag.split(/, ?/);
		this.description = post.extended;
	},

	/**
	 * Returns the url for this bookmark
	 * @return {String} The url
	 */	
	getUrl : function () {
		return this.url;
	},
	
	/**
	 * Returns the title for this bookmark
	 * @return {String} The title
	 */	
	getTitle : function () {
		return this.title;
	},
	
	/**
	 * Returns the labels for this bookmark
	 * @return {Array} The labels
	 */	
	getLabels : function () {
		return this.labels;
	},
	
	/**
	 * Returns the description for this bookmark
	 * @return {String} The description
	 */	
	getDescription : function () {
		return this.description;
	},
	
	getId : function () {
		return this.id;
	},
	
	toQuery : function () {
		
	},
	
	toString : function() {
		return this.getUrl();
	}

});

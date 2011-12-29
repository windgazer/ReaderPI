/**
 * Primary function was to differentiate between W3C widget storage and HTML5
 * localStorage.
 * The intention is to add a form of authenticated online storage so that a user 
 * can access his/her settings accross several machines. This form of storage would
 * hopefully make use of a pre-existing mechanism.
 * 
 * @class
 * @augments Class
 */
var Settings = Class.extend(
/** @lends Settings */
{

	day:(24*60*60*1000),

	/**
	 * Construct a Settings class with specific application pre-fix :)
	 * 
	 * @argument {String} prefix A unique prefix for an application under which to store its' preferences.
	 * @constructs
	 */
	init : function( prefix ) {

		this.prefix = prefix;

		var storeOnline = this.getPreference("online-storage");
		
		if ( storeOnline === null || typeof storeOnline === "undefined" ) {

			//Setup the default values!!
			
			console.log("Setting up the default values :)");
			this.setPreference("online-storage", true);
			this.setPreference("ls-ls-limit-width", true);
			this.setPreference("p-p-limit-height", true);
			this.setPreference("ls-ls-force-width", true);
			this.setPreference("p-p-force-height", true);

		}

	},

	/**
	 * This creates a cookie,
	 * for internal use only (as a browser alternative to widget.setPreferenceForKey)
	 * 
	 * @param {Object} name
	 * @param {Object} value
	 * @param {Object} days
	 * 
	 * @private
	 */	
	createCookie:function(name,value,days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*Settings.day));
			expires = "; expires="+date.toGMTString();
		}
		else expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},

	/**
	 * This is for reading cookies, 
	 * for internal use only (as a browser alternative to widget.preferenceForKey)
	 * 
	 * @param {Object} name
	 * 
	 * @private
	 */
	readCookie:function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},

	/**
	 * This is for erasing cookies. Not really in use atm, but I added it just in case :)
	 * 
	 * @param {Object} name
	 * 
	 * @private
	 */
	eraseCookie:function(name) {
		this.createCookie(name,"",-1);
	},
	
	getKey:function(key) {
		return this.prefix + "." + key;
	},

	/**
	 * Get preference from whatever type of storage we can detect, in case
	 * of widgets the preferred method is preferenceKey, in case of browsers
	 * the preferred method is localStorage. The final fallback is cookies.
	 * 
	 * @param {Object} key
	 */
	getPreference:function(key) {
		var k = this.getKey( key );
		var w = window.widget||false;
		if (
			w
			&& w.preferenceForKey
		) {
			return w.preferenceForKey(k);
		} else {
			if (localStorage) {
				return localStorage.getItem(k);
			}
			return this.readCookie(k);
		}
	},

	/**
	 * Set a preference to whatever type of storage we can detect. In case
	 * of widgets the default is widget.setPreferenceForKey, if not available
	 * checking for localStorage.setItem and as a final fallback going for
	 * cookies.
	 * 
	 * @param {String} key A unique identifier for this information
	 * @param {String} value Whatever value you want to store, must be serialised.
	 */
	setPreference:function(key, value) {
		var k = this.getKey( key );
		var w = window.widget||false;
		if (
			w
			&& w.setPreferenceForKey
		) {
			w.setPreferenceForKey(value, k);
		} else {
			if (localStorage) {
				return localStorage.setItem(k, value);
			} else {
				this.createCookie(k, value, 60);
			}
		}
	},
	
	setUrl : function ( key, href ) {

		if ( this.isStoreOnline() ) {
			DeliciousAPI.createBookmark( new DeliciousBookmark( this.sanitizeKey( key ), href, key, null, key ) );
		} else {
			this.setPreference( key, href );
		}
		
	},
	
	getUrl : function ( key ) {

		if ( this.isStoreOnline() ) {
			var bm = DeliciousAPI.retrieveBookmark( this.sanitizeKey( key ) );
			if (bm) {
				return bm.getUrl();
			}
		} else {
			return this.getPreference( key );
		}
		
		return null;
	},
	
	deleteUrl : function ( key, href ) {
		if ( this.isStoreOnline() ) {
			DeliciousAPI.deleteBookmark( new DeliciousBookmark( this.sanitizeKey( key ), href, key, null, key ) );
		} else {
			this.setPreference( key, null );
		}
	},
	
	sanitizeKey : function ( key ) {
		return key.replace(/ /g, "-");
	},
	
	isStoreOnline : function () {

		var storeOnline = this.getPreference( "online-storage" );

		if ( ( storeOnline === true || storeOnline === "true" ) && !DeliciousAPI.isAuthenticated() ) {
			//Authenticate first :)
			DeliciousAPI.authenticate( "Windgazer", "D)d0xl" );
		}
		
		return storeOnline && DeliciousAPI.isAuthenticated();

	}

});

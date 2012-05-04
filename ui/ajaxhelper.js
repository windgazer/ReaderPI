(function() {

	/**
	 * A simplistic Ajax wrapper, since I don't want to include 30k of useless code from
	 * an existing library just to gain a nice cross-browser ajax wrapper...
	 */
	window.AJAXHelper = {
		async: true,
		/**
		 * Method that uses Ajax to get the responseText and parse it as JSON.
		 * 
		 * @param {String} url The url to call and return data for.
		 * @param {function} callback The callback method that gets the JSON data as a parameter.
		 * @param {boolean} async Optional parameter to force synced/asynced call.
		 */
		getData:function(url, callback, async, content, xml) {
			var xhr = false;
			if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			} else if (window.ActiveXObject) {
				try {
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
				} catch(e) {
					try {
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					} catch(e) {
						xhr = false;
					}
				}
			}
			if(xhr) {
				xhr.onreadystatechange = function() {
					if ( typeof xml === 'undefined' || xml !== true ) {
						AJAXHelper._parseJSON( xhr, callback );
					} else {
						AJAXHelper._parseXML( xhr, callback );
					}
				};
	
				var as = (typeof async === 'undefined')?AJAXHelper.async:async;
				
				if (typeof content === 'undefined' || content===null) {
					xhr.open( "GET", url, as );
					xhr.send(null);
				} else {
					xhr.open(  "POST", url, as  );
					xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr.send(content);
				}
	
				return true;
			} else {
				return false;
			}
		},
		/**
		 * Internal callback method that checks the response for correct conclusion and
		 * then parses the responseText as JSON. calls the callback method with the JSON
		 * Object or request.responseText if it failed to parse or didn't have JSON to
		 * start with.
		 * 
		 * @private
		 */
		_parseJSON:function(request, callback) {
			if (request.readyState == 4) {
				if (request.status == 200 || request.status == 304) {
					try {
						eval(request.responseText);
					} catch(e) {
						callback(request.responseText);
					}
				} else {
					callback(null);
				}
			}
		},
		/**
		 * Internal callback method that checks the response for correct conclusion and
		 * then parses the responseText as XML. calls the callback method with the XML
		 * Object or request.responseText if it failed to parse or didn't have XML to
		 * start with.
		 * 
		 * @private
		 */
		_parseXML:function(request, callback) {
			if (request.readyState == 4) {
				if (request.status == 200 || request.status == 304) {
					try {
						eval(request.responseXML);
					} catch(e) {
						callback(request.responseText);
					}
				} else {
					callback(null);
				}
			}
		}
	};

})();
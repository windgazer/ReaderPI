/**
 * This File contains the main classes for creating and controlling the ComicReader.
 * 
 * @fileoverview
 */
(function() {

	/**
	 * This is the class that stores and retreives the comics data.
	 * This class is in serious need of refactoring!!!
	 * 
	 * @class
	 */
	var ComicReader = Class.extend ({
		keys: {
			currentComicID:"cid",
			currentComicEntry:"entry."
		},
		/**
		 * Initialize the reader with any new data it may have picked up while libraries were loading.
		 */
		init:function() {

			this.entry = null;
			this.comics = new Array();
			this.settings = null;
			this.gui = false;
			
			var self = this;
			
			
			//When authentication has finished...
			window.ce.attachEvent( ON_AUTH_SUCCESS, function() {
				self.authSuccess();
			});

			//Since, among things, the settings take care of auth, can't sun this until the GUI is done loading...
			Events.attach(window, "load", function() {
				self.settings = new Settings("nl.windgazer.comicreader");
				self.gui = true;
			});
		
		},
		authSuccess:function() {
	
				this.setupComicSelector();
		
				var cs = document.getElementById("comicSelector");
				var self = this;
				Events.attach(cs, "change", function() {
					var cid = cs.options[cs.selectedIndex].value;
					self.fetchCurrentEntry(cid);
				});
		
				var cid = this.settings.getPreference(this.keys.currentComicID);
	
				this.fetchCurrentEntry(cid);
		},
		/**
		 * Set the next entry on the comic reader, used as a callback from
		 * any of the getXXXEntry calls in the ReaderComic class.
		 */
		setNextEntry:function(entry) {
			if (entry) {
				var id = entry.getComic().getTitle();
	
	//			if (ComicReader.entry) {
	//				this.settings.deleteUrl(ComicReader.keys.currentComicEntry + id, ComicReader.entry.getHREF());
	//			}
	
				this.entry = entry;
				var disp = this.createDisplay(entry);
				var cr = document.getElementById("ComicReader");
				if (cr.childNodes && cr.childNodes.length > 1) {
					cr.removeChild(cr.firstChild);
				}
				cr.appendChild(disp);
				this.settings.setUrl(this.keys.currentComicEntry + id, entry.getHREF());
				//Delay hiding/revealing until the image has actually finished loading!
				var img = disp.firstChild.firstChild;
				
				var self = this;
				Events.attach(img, "load", function() {
					self.cancelQuery();
					var landscape = Math.max(img.width,img.height)===img.width;
					cr.firstChild.className = cr.firstChild.className.replace(/\s?\bactive\b/,"");
					disp.className += (" active img" + (landscape?"Landscape":"Portait"));
				});
	
			} else {
	
				this.cancelQuery();
	
			}
		},
		fetchNextEntry:function() {
			if (this.entry.getHasNextEntry()) {
				this.lockInterface();
				this.entry.getComic().getNextEntry(this.entry);
				return true;
			}
			return false;
		},
		fetchPrevEntry:function() {
			if (this.entry.getHasPrevEntry()) {
				this.lockInterface();
				this.entry.getComic().getPrevEntry(this.entry);
				return true;
			}
			return false;
		},
		fetchLatestEntry:function(cid) {
			this.lockInterface();
			if (cid) {
				this.listComics()[cid].getLatestEntry();
			} else if (this.entry) {
				this.entry.getComic().getLatestEntry();
			} else {
				this.cancelQuery();
			}
		},
		/**
		 * This method fetches the current entry that is active for the actor. This method must
		 * be used to switch from one comic to the next as it is the only one that attempts to
		 * store the id of the comic.
		 */
		fetchCurrentEntry:function(cid) {
			this.lockInterface();
			var cidf = cid||this.settings.getPreference(this.keys.currentComicID);
			if (cidf) {//If we manage to obtain an id, continue to load an entry.
				if (cid) { //If a comic id was provided we're 'switching' to a new comic and preserve this knowledge.
					this.settings.setPreference(this.keys.currentComicID, cid);
				}
				var entryUrl = this.settings.getUrl(this.keys.currentComicEntry + cidf);
				if (entryUrl) { //If a known entry is found, let's grab it.
					this.getComicById(cidf).getEntryByHREF(entryUrl);
				} else { //Else load the latest entry for the comic from the comic website.
					this.fetchLatestEntry(cidf);
				}
			}
		},
		lockInterface: function() {
			document.body.className += " inprogress";
		},
		cancelQuery: function() {
			document.body.className = document.body.className.replace(/ ?\binprogress\b/gi, "");
		},
		/**
		 * @private
		 */
		createDisplay:function(entry) {
			var div = document.createElement("div");
			div.className = "entry";
			var a = document.createElement("a");
			a.href = entry.getHREF();
			a.title = entry.getTitle();
			var img = document.createElement("img");
			img.src = entry.getIMG();
			img.alt = entry.getTitle();
			div.appendChild(a);
			a.appendChild(img);
			return div;
		},
		/**
		 * Returns a list(array) of comics.
		 */
		listComics:function() {
			return this.comics;
		},
		/**
		 * Adds a comic to the list.
		 */
		addComic:function(comic) {
			this.comics[comic.getTitle()] = comic;
		},
		getComicById:function(cid) {
			return this.comics[cid];
		},
		/**
		 * Setup controls to list all available comics.
		 */
		setupComicSelector:function() {
			var cs = document.getElementById("comicSelector");
			var cid = this.settings.getPreference(this.keys.currentComicID);
			cs.options.length = 0; //Wipe out existing options.
			for ( i in this.comics ) {
				var c = this.comics[i];
				var selected = cid&&cid==c.getTitle();
				cs.options[cs.options.length] = new Option(c.getTitle(), c.getTitle(), false, selected);
			}
		}
	});

	window.ComicReader = new ComicReader();

})();


/**
 * Basic Reader Comic class. It contains the methods that are to be expected from an implementation.
 * 
 * @class
 */
var ReaderComic = Class.extend ( {

	/**
	 * Initiate a new Reader. Most importantly to keep the title stored.
	 * 
	 * @constructor
	 */
	init: function(configJSON){
		this.config = configJSON;
		this.callback = function(o){ComicReader.setNextEntry(o);};
	},
	
	getTitle:function() {
		return this.config["title"];
	},

	/**
	 * Returns the latest ComicEntry for this particular Comic. Takes no parameter, just
	 * grabs the latest entry...
	 */
	getLatestEntry:function(){
		throw "Latest entry is not implemented for '" + this.getTitle() + "'";
	},

	getNextEntry:function(entry) {
		throw "Next entry is not implemented for '" + this.getTitle() + "'";
	},

	getPrevEntry:function(entry) {
		throw "Previous entry is not implemented for '" + this.getTitle() + "'";
	},

	getEntryByHREF:function(href) {
		throw "Entry by HREF is not implemented for '" + this.getTitle() + "'";
	}

});



/**
 * Create a new entry, config is a JSON object with 'title' and 'href' string values.
 * Fields expected to possibly be contained in the config are:
 * title, img, href, comic, next, prev
 * 
 * @argument {JSON} configJSON The basic values of this entry.
 * @argument {JSON} opt Optional JSON Object containing optional methods.
 * @constructor
 */
function ComicEntry (
	configJSON,
	opt
) {
	this.config = configJSON;
	this.opt = opt;
};

ComicEntry.prototype = {
	/**
	 * Get the title of this entry as a String.
	 */
	getTitle:function() {
		return this.config["title"];
	},
	/**
	 * Set the title of the entry as a String.
	 */
	setTitle:function(value) {
		this.config["title"] = value;
	},
	/**
	 * Get the IMG of this entry as a String.
	 */
	getIMG:function() {
		return this.config["img"];
	},
	/**
	 * Set the IMG of this entry as a String.
	 */
	setIMG:function(value) {
		this.config["img"] = value;
	},
	/**
	 * Get the HREF of this entry as a String.
	 */
	getHREF:function() {
		return this.config["href"];
	},
	/**
	 * Set the HREF of this entry as a String.
	 */
	setHREF:function(value) {
		this.config["href"] = value;
	},
	getComic:function() {
		return this.config["comic"];
	},
	getHasNextEntry:function() {
		if ( this.opt && this.opt.getHasNextEntry ) {
			return this.opt.getHasNextEntry( this );
		}
		if ( this.config[ "next"] ) {
			return true;
		}
		return false;
	},
	getHasPrevEntry:function() {
		if ( this.opt && this.opt.getHasPrevEntry ) {
			return this.opt.getHasPrevEntry( this );
		}
		if ( this.config[ "prev"] ) {
			return true;
		}
		return false;
	}
};

/**
 * A simplistic Ajax wrapper, since I don't want to include 30k of useless code from
 * an existing library just to gain a nice cross-browser ajax wrapper...
 */
var AJAXHelper = {
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

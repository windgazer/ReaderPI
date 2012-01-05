/**
 * An extension of the basic ComicReader for an offline comic reader, for testing purposes mostly...
 *
 * @class
 */
var OfflineComicTester = ReaderComic.extend({

	/**
	 * 
	 * @param {String} sTitle The title of this comic, also internally used as an ID for this comic.
	 * @param {Array} aComics An array of ComicEntries
	 * 
	 * @constructor
	 */
	init: function( sTitle, aEntries ) {
		this._super( { title: sTitle } );
		this.entries = aEntries;
		
		//Interlink all entries in the array.
		var i = 0, prev=this.entries[i++], entry = this.entries[i++]
		for (i = i; i <= this.entries.length; entry = this.entries[i++]) {
			prev.config["comic"] = entry.config["comic"] = this;
			prev.config["next"] = entry;
			entry.config["prev"] = prev;
			prev = entry;
		}
		
		Console.log(this.entries, i, entry);
	},

	getLatestEntry: function( ) {
		Console.log("Getting latest offline entry!");
		this.callback(this.entries[this.entries.length - 1]);
	},

	getPrevEntry: function( entry ) {
		Console.log("Getting previous offline entry!");

		this.callback(entry.config["prev"]);
	},

	getNextEntry: function( entry ) {
		Console.log("Getting next offline entry!");

		this.callback(entry.config["next"]);
	},

	getEntryByHREF: function( url ) {
		Console.log("Getting offline entry by url for '" + url + "'");
		for (var i = 0; i < this.entries.length; i++) {
			var entry = this.entries[i];
			if ( url === entry.getHREF() ) {
				this.callback( entry );
				return;
			}
		}
		this.callback(null);
	}

});

(function(){

	// title, img, href, comic, next, prev
	var offlineComic = new OfflineComicTester("Test Offline", [
		new ComicEntry({
			"title":"Big Panorama",
			"img":"assets/dummy/Panorama_Big.png",
			"href":"//localhost/TCE1",
			"comic":offlineComic,
			"next":null,
			"prev":false,
		}),
		new ComicEntry({
			"title":"Small Panorama",
			"img":"assets/dummy/Panorama_Small.png",
			"href":"//localhost/TCE2",
			"comic":offlineComic,
			"next":null,
			"prev":null,
		}),
		new ComicEntry({
			"title":"Big Portait",
			"img":"assets/dummy/Portrait-Big.png",
			"href":"//localhost/TCE3",
			"comic":offlineComic,
			"next":null,
			"prev":null,
		}),
		new ComicEntry({
			"title":"Small Portrait",
			"img":"assets/dummy/Portrait-Small.png",
			"href":"//localhost/TCE4",
			"comic":offlineComic,
			"next":null,
			"prev":null,
		}),
		new ComicEntry({
			"title":"Square",
			"img":"assets/dummy/Square.png",
			"href":"//localhost/TCE5",
			"comic":offlineComic,
			"next":false,
			"prev":null,
		})
	]);
	
	ComicReader.addComic(offlineComic);

})();

(function(){

	Events.attach(window, "load", function() {
		document.getElementById("auth-uid").value = "Windgazer";
		document.getElementById("auth-pwd").value = "D)d0xl";
	});

})();
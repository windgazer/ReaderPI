/**
 * This is a set of functions that should help setup the overal user interaction
 * for our interface. The intention is to try to seamlessly meld swipe/scroll/click
 * interactions from different platforms.
 * 
 * @fileoverview
 */

(function(){
	
	var Reader = nl.windgazer.Reader;

	ce.attachEvent( Constants.COMIC_EVENT_ID, function( eid, data ) {
		
		console.log("Reacting to " + Constants.COMIC_EVENT_ID + " event.");
		
		if ( data.entry == null ) {
			throw "Comic Fetch Failed!!!";
		}

		var img = document.getElementById("comicImage"),
			e = data.entry,
			is = img.src,
			es = e.getImgURL();
		
		Reader.setEntry( e );
		Reader.setComic( data.comic );
		document.getElementById("entryUrlInput").value = e.getCurrentURL();

		if (img.src === e.getImgURL()) {

			ce.fireEvent( Constants.COMIC_FETCH_FAILED, { msg:"Repeated attempt to render the same comic (which would've caused img.onLoad to fail)", exception:null, data:data, context: null } );
			throw "Comic Fetch Repeated!!!";

		} else {

			img.src = e.getImgURL();

		}
		window.location.replace('#ComicReader');

	} );

	function fetchPrevious() {
		var r = Reader, c = r.getComic(), e = r.getEntry();
		if ( e.getPrevURL(  ) ) {
			c.fetchByURL ( e.getPrevURL(  ) );
		}
	}

	function fetchNext() {
		var r = Reader, c = r.getComic(), e = r.getEntry();
		if ( e.getNextURL(  ) ) {
			c.fetchByURL ( e.getNextURL(  ) );
		}
	}

	function fetchLatest() {
		var r = Reader, c = r.getComic(), e = r.getEntry();
		if ( e.getNextURL(  ) ) { //No need to fire if we're already there...
			c.fetchLatest (  );
		}
	}
	
	function entryByUrl() {
		var inp = document.getElementById("entryUrlInput"),
			r = Reader, c = r.getComic();

		var url = inp.value;

		c.fetchByURL( url );
		
		inp.value = "";

	}

	LinkListener.addHandler( "prevEntry", fetchPrevious );

	LinkListener.addHandler( "nextEntry", fetchNext );

	LinkListener.addHandler( "latestEntry", fetchLatest );

	LinkListener.addHandler( "entryByUrl", entryByUrl );
	
	ScreenEdgeEvents.attachEvent( ScreenEdgeEvents.EDGE_EVENT_LEFT, fetchPrevious );
	
	ScreenEdgeEvents.attachEvent( ScreenEdgeEvents.EDGE_EVENT_RIGHT, fetchNext );
	
	function openMenu( ) {
		var hash = window.location.hash;
		if ( hash ) {
			if ( hash.substr(1) !== "ComicReader" ) return;
		}
		window.location.replace('#menu');
		window.setTimeout(function() {

			document.body.className += " menuEnabled";

		}, 10);
	}
	
	function closeMenu( ){

		document.body.className = document.body.className.replace(/ ?\bmenuEnabled\b/g, "");

	}

	try {
		blackberry.app.event.onSwipeDown(openMenu);
	} catch ( e ) {
		ScreenEdgeEvents.attachEvent( ScreenEdgeEvents.EDGE_EVENT_TOP, openMenu );
		console.warn( "If you're not running this on a BlackBerry Device, don't worry about it :)", e );
	}

	ce.attachEvent( Constants.COMIC_FETCH_INPROGRESS, closeMenu);
	
	Events.attach( window, "hashchange", closeMenu );

	function selectNewComic() {
		var cs = document.getElementById("comicSelector");
		var o = cs.options[ cs.selectedIndex ]
		var id = o.value;
		var c = Comics.getComic( id ); 

		c.fetchLast();
	}
	
	ce.attachEvent( Constants.COMIC_FETCH_INPROGRESS, function(){
		var b = document.getElementsByTagName("body")[0];
		b.className += " inprogress";
	});
	
	ce.attachEvent( Constants.COMIC_FINISHED_LOADING, function(){
		var b = document.getElementsByTagName("body")[0];
		var ci = document.getElementById("comicImage");
		b.className = b.className.replace(/ ?\binprogress\b/g, "");

		ci.parentNode.className = ci.parentNode.className.replace( / ?\bimg(L|P)\w+\b/g,"");
		var landscape = ci.height / ci.width  < 1;
		ci.parentNode.className += landscape?" imgLandscape":" imgPortrait";
	});
	
	ce.attachEvent( Constants.COMIC_FETCH_FAILED, function() {

		var b = document.getElementsByTagName("body")[0];
		b.className = b.className.replace(/ ?\binprogress\b/g, "");

	});

	Events.attach( window, "load", function() {

		var comics = Comics.getComics(),
			cs = document.getElementById("comicSelector"),
			b = document.getElementsByTagName("body")[0];
		
		for (var i = 0; i < comics.length; i++) {
			var c = comics[i];
			cs.options[i] = new Option(c.getTitle(), c.getId(), i==0, i==0);
		}
		
		Events.attach( cs, "change", selectNewComic );
		
		var ci = document.getElementById("comicImage");
		Events.attach( ci, "load", function() {

			ce.fireEvent( Constants.COMIC_FINISHED_LOADING, { dom: ci, entry:Reader.getEntry( ), comic: Reader.getComic( )  } );

		});
		
		KeyListener.addHandler( KeyListener.KEYS.KEY_LEFTARROW, function( target ){

			fetchPrevious();

		});
		KeyListener.addHandler( KeyListener.KEYS.KEY_RIGHTARROW, function( target ){

			fetchNext();

		});

	});

})();

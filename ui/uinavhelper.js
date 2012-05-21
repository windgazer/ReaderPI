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
		
		Reader.setEntry( data.entry );
		Reader.setComic( data.comic );

		document.getElementById("comicImage").src = data.entry.getImgURL();

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

	LinkListener.addHandler( "prevEntry", fetchPrevious );

	LinkListener.addHandler( "nextEntry", fetchNext );

	LinkListener.addHandler( "latestEntry", fetchLatest );

	var scrollTracker = { x: 0, y: 0, vert: true, velocity: 0, t: 0 };

	function screenEdgeEventHandler( e ) {
		e = e ? e : window.event;
		var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 30;
		var isVertical = false;
		var isEdgeX = scrollTracker.x === window.scrollX;
		var atEdgeLeft = window.scrollX <= 0;
		var atEdgeRight = document.body.clientWidth + window.scrollX >= document.body.scrollWidth;
		var isEdgeY = scrollTracker.y === window.scrollY;
		var atEdgeTop = window.scrollY <= 0; //Small grace-area (due to 'bounce' in some browser UI's)
		var atEdgeBottom = document.body.clientHeight + window.scrollY >= document.body.scrollHeight;
		var now = new Date().getTime();
		var timeout = now - scrollTracker.t;

		//Some hackeridoo to figure this out between WebKit / Mozilla
		if ( typeof e.axis === "undefined" ) {
			isVertical = Math.abs( e.wheelDeltaY ) > Math.abs( e.wheelDeltaX );
		} else {
			isVertical = e.axis > 1;
		}
		var body = document.getElementsByTagName("body")[0];
		
		//console.debug("Checking outcome (wheelData, isVertical, isEdgeX, isEdgeY, e)", wheelData, isVertical, isEdgeX, isEdgeY, e);

		if ( isVertical ) {

			if ( atEdgeTop && ( timeout > 1000 ) && wheelData > 3 ) {

				if ( Options.isDebug() ) console.debug( "Show top menu" );
				body.className += " menuEnabled";

			} else if ( wheelData < 0 ) {

				if ( Options.isDebug() ) console.debug( "Hide top menu" );
				body.className = body.className.replace(/ ?\bmenuEnabled\b/g, "");

			} else {

				//Reset timeout to previous state if at the edge...
				if ( atEdgeTop || atEdgeBottom ) {

					now = scrollTracker.t;

				}

			}

		} else {
			
			//console.log(( timeout > 100 ), wheelData, isEdgeX);

			if ( atEdgeLeft && ( timeout > 150 ) && wheelData > 0 ) {

				console.log("PREV SWIPE", e);
				fetchPrevious();

			}

			if ( atEdgeRight && ( timeout > 150 ) && wheelData < 0 ) {

				console.log("NEXT SWIPE", e);
				fetchNext();

			}

		}

		scrollTracker = { x: window.scrollX, y: window.scrollY, vert: isVertical, velocity: wheelData, t: now };

	}

	Events.attach( window, "mousewheel", screenEdgeEventHandler );
	Events.attach( window, "DOMMouseScroll", screenEdgeEventHandler );

	ce.attachEvent( Constants.COMIC_FETCH_INPROGRESS, function(){

		document.body.className = document.body.className.replace(/ ?\bmenuEnabled\b/g, "");

	});

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

		b.className = b.className.replace(/ ?\binprogress\b/g, "");

	});

	Events.attach( window, "load", function() {

		var comics = Comics.getComics(),
			cs = document.getElementById("comicSelector");
		
		for (var i = 0; i < comics.length; i++) {
			var c = comics[i];
			cs.options[i] = new Option(c.getTitle(), c.getId(), i==0, i==0);
		}
		
		Events.attach( cs, "change", selectNewComic );
		
		var ci = document.getElementById("comicImage");
		Events.attach( ci, "load", function() {

			ce.fireEvent( Constants.COMIC_FINISHED_LOADING, { dom: ci, entry:Reader.getEntry( ), comic: Reader.getComic( )  } );

		});

	});

})();

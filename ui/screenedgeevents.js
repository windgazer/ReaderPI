/**
 * This file intends to provide some support framework for detecting screen-edge
 * events. The basic principle in this case being, after scrolling, if another
 * attempt is made to 'scroll' beyond the edge of the screen, an event may be
 * triggered to provide aditional content / navigation, or anything else you may
 * think of :)
 * 
 * This should provide a nice basic setup for HTML5 based applications that deal
 * with multiple pages of content, or want to save real-estate on the screen yet
 * provide options / navigation in side / top-down menu's and the likes.
 * 
 * @fileoverview
 */

var ScreenEdgeEvents = ( function( g_w, g_e ) {

	var window        = g_w,
		Events        = g_e,
		scrollTracker = { x: 0, y: 0, vert: true, velocity: 0, t: 0 },
		isEdgeX       = false,
		atEdgeLeft    = false,
		atEdgeRight   = false,
		isEdgeY       = false,
		atEdgeTop     = false,
		atEdgeBottom  = false,
		isVertical    = false,
		now           = new Date().getTime(),
		timeout       = -1,
		body          = null,
		debug         = null,
		handlers      = [],
		eventIDs      = [
			"nl.windgazer.topEdgeEvent",
			"nl.windgazer.bottomEdgeEvent",
			"nl.windgazer.leftEdgeEvent",
			"nl.windgazer.rightEdgeEvent"
		],
		resetTimer    = null; //TODO: Use a timeout to reset all base-values, resetting it as long as scroll-events are being fired.

	
	var PublicAccess = {

		EDGE_EVENT_TOP    : eventIDs[ 0 ],

		EDGE_EVENT_BOTTOM : eventIDs[ 1 ],

		EDGE_EVENT_LEFT   : eventIDs[ 2 ],

		EDGE_EVENT_RIGHT  : eventIDs[ 3 ],

		attachEvent       : function ( eventID, method ) {

			handlers[ eventID ].push( method );

		}

	}

	for ( var seei = 0, seel = eventIDs.length; seei < seel; seei++ ) {

		handlers[ eventIDs[ seei ] ] = [];

	}

	/**
	 * This method attempts to prep the data for scroll-based events, using traditional media.
	 * The main difference with touch-based events on portable media is that we may receive a
	 * number of subsequent events with no idea which is the first of single action of the user.
	 * 
	 * In touch-based events we can determine because of the onTouchStart event being fired
	 * first, at all times.
	 * 
	 * @argument {Event} e The event for which to parse the data.
	 */
	function prepScrollData( e ) {

		if ( body === null ) body = document.getElementsByTagName("body")[0];
		if ( debug === null ) debug = ( Options && Options.isDebug() )?true:false;

		var e = e ? e : window.event; //In case IE start supporting these standards, or even already does :)

		wheelData    = e.detail ? e.detail * -1 : e.wheelDelta / 30;
		isEdgeX      = scrollTracker.x === window.scrollX;
		atEdgeLeft   = window.scrollX <= 0;
		atEdgeRight  = document.body.clientWidth + window.scrollX >= document.body.scrollWidth;
		isEdgeY      = scrollTracker.y === window.scrollY;
		atEdgeTop    = window.scrollY <= 0; //Might need small grace-area (due to 'bounce' in some browser UI's)
		atEdgeBottom = document.body.clientHeight + window.scrollY >= document.body.scrollHeight;
		now          = new Date().getTime();
		timeout      = now - scrollTracker.t; //Used for determining 'fresh' scroll attempt (kinetic scrolling fires a large number of subsequent scroll events)

		//Some hackeridoo to figure this out between WebKit / Mozilla
		if ( typeof e.axis === "undefined" ) {
			isVertical = Math.abs( e.wheelDeltaY ) > Math.abs( e.wheelDeltaX );
		} else {
			isVertical = e.axis > 1;
		}

	}
	
	function determineEventResolution() {

		if ( isVertical ) {

			if ( atEdgeTop && ( timeout > 1000 ) && wheelData > 3 ) {

				console.log("TOP-EDGE SWIPE");
				var ha = handlers[ PublicAccess.EDGE_EVENT_TOP ];
				for ( var i = 0, l = ha.length; i < l; i++ ) {

					ha[ i ]( );

				}
				//body.className += " menuEnabled";

			} else if ( wheelData < 0 ) {

				if ( debug ) console.debug( "Hide top menu" );
				//body.className = body.className.replace(/ ?\bmenuEnabled\b/g, "");

			} else {

				//Reset timeout to previous state if at the edge...
				if ( atEdgeTop || atEdgeBottom ) {

					now = scrollTracker.t;

				}

			}

		} else {
			
			//console.log(( timeout > 100 ), wheelData, isEdgeX);

			if ( atEdgeLeft && ( timeout > 150 ) && wheelData > 0 ) {

				console.log("LEFT-EDGE SWIPE");
				var ha = handlers[ PublicAccess.EDGE_EVENT_LEFT ];
				for ( var i = 0, l = ha.length; i < l; i++ ) {

					ha[ i ]( );

				}

			}

			if ( atEdgeRight && ( timeout > 150 ) && wheelData < 0 ) {

				console.log("RIGHT-EDGE SWIPE");
				var ha = handlers[ PublicAccess.EDGE_EVENT_RIGHT ];
				for ( var i = 0, l = ha.length; i < l; i++ ) {

					ha[ i ]( );

				}

			}

		}

	}

	function screenEdgeScrollEventHandler( e ) {
		
		prepScrollData( e );
		
		determineEventResolution();

		scrollTracker = { x: window.scrollX, y: window.scrollY, vert: isVertical, velocity: wheelData, t: now };

	}

	Events.attach( window, "mousewheel", screenEdgeScrollEventHandler );
	Events.attach( window, "DOMMouseScroll", screenEdgeScrollEventHandler );
	
	return PublicAccess;

})( window, Events );
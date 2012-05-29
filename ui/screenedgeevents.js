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
		scrollTracker, isEdgeX, atEdgeLeft, atEdgeRight, isEdgeY, atEdgeTop, atEdgeBottom, isVertical, hasFired,
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


	/**
	 * This contains all publically accessible methods. Since almost everything in this set
	 * of functions is self-contained, all public access is based upon allowing an
	 * external piece of software to add handlers to this closure.
	 * 
	 */	
	var PublicAccess = {

		EDGE_EVENT_TOP    : eventIDs[ 0 ],
		EDGE_EVENT_BOTTOM : eventIDs[ 1 ],
		EDGE_EVENT_LEFT   : eventIDs[ 2 ],
		EDGE_EVENT_RIGHT  : eventIDs[ 3 ],

		/**
		 * Add handler to the ScreenEdgeEvents closure. This is the main accessing method to
		 * enable any code to easily react to document edges.
		 */
		attachEvent       : function ( eventID, method ) {

			handlers[ eventID ].push( method );

		}

	}

	for ( var seei = 0, seel = eventIDs.length; seei < seel; seei++ ) {

		handlers[ eventIDs[ seei ] ] = [];

	}

	/**
	 * This method will reset the data to it's default state.
	 * 
	 */	
	function resetData( ) {

		scrollTracker = { x: 0, y: 0, vert: true, velocity: 0 };
		isEdgeX       = false;
		atEdgeLeft    = false;
		atEdgeRight   = false;
		isEdgeY       = false;
		atEdgeTop     = false;
		atEdgeBottom  = false;
		isVertical    = false;
		hasFired      = false;
		resetTimer    = null; //TODO: Use a timeout to reset all base-values, resetting it as long as scroll-events are being fired.

	}

	resetData( );

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

		var	atEdgeLeftNow   = window.scrollX <= 0,
			atEdgeRightNow  = document.body.clientWidth + window.scrollX >= document.body.scrollWidth,
			atEdgeTopNow    = window.scrollY <= 0, //Might need small grace-area (due to 'bounce' in some browser UI's)
			atEdgeBottomNow = document.body.clientHeight + window.scrollY >= document.body.scrollHeight;
		

		if ( resetTimer === null ) { //First run

			atEdgeLeft   = atEdgeLeftNow;
			atEdgeRight  = atEdgeRightNow;
			atEdgeTop    = atEdgeTopNow;
			atEdgeBottom = atEdgeBottomNow;

		} else {

			//Previously false values must stay false
			atEdgeLeft   = atEdgeLeft && atEdgeLeftNow;
			atEdgeRight  = atEdgeRight && atEdgeRightNow;
			atEdgeTop    = atEdgeTop && atEdgeTopNow;
			atEdgeBottom = atEdgeBottom && atEdgeBottomNow;

		}

		isEdgeX      = atEdgeLeft || atEdgeRight;
		isEdgeY      = atEdgeTop || atEdgeBottom;


		//Some hackeridoo to figure this out between WebKit / Mozilla
		if ( typeof e.axis === "undefined" ) {

			isVertical = Math.abs( e.wheelDeltaY ) > Math.abs( e.wheelDeltaX );

		} else {

			isVertical = e.axis > 1;

		}

		//Automatic reset of data, if at least 125 milliseconds without a scrollEvent take place, we're starting from scratch :)
		if ( resetTimer !== null ) {

			window.clearTimeout( resetTimer );

		}
		resetTimer = window.setTimeout( function() { resetData( ); }, 125 );

	}

	/**
	 * This method is aiming to resolve wehter or not we're to be firing an edge
	 * level event.
	 * 
	 */
	function determineEventResolution( ) {
		
		if ( hasFired ) return false; //Don't fire again until reset

		if ( isVertical ) {

			if ( atEdgeTop && wheelData > 3 ) {

				hasFired = true;
				console.log("TOP-EDGE SWIPE");
				var ha = handlers[ PublicAccess.EDGE_EVENT_TOP ];
				for ( var i = 0, l = ha.length; i < l; i++ ) {

					ha[ i ]( );

				}

			} else if ( wheelData < 0 ) {

				//Not sure if this part is still needed...

			} else {

				//Reset timeout to previous state if at the edge...
				if ( atEdgeTop || atEdgeBottom ) {

					now = scrollTracker.t;

				}

			}

		} else {

			if ( atEdgeLeft && wheelData > 0 ) {

				hasFired = true;
				console.log("LEFT-EDGE SWIPE");
				var ha = handlers[ PublicAccess.EDGE_EVENT_LEFT ];
				for ( var i = 0, l = ha.length; i < l; i++ ) {

					ha[ i ]( );

				}

			}

			if ( atEdgeRight && wheelData < 0 ) {

				hasFired = true;
				console.log("RIGHT-EDGE SWIPE");
				var ha = handlers[ PublicAccess.EDGE_EVENT_RIGHT ];
				for ( var i = 0, l = ha.length; i < l; i++ ) {

					ha[ i ]( );

				}

			}

		}

	}

	/**
	 * Handler to process scroll-based events
	 */
	function screenEdgeScrollEventHandler( e ) {
		
		prepScrollData( e );
		
		determineEventResolution();

		scrollTracker = { x: window.scrollX, y: window.scrollY, vert: isVertical, velocity: wheelData };

	}

	Events.attach( window, "mousewheel", screenEdgeScrollEventHandler );
	Events.attach( window, "DOMMouseScroll", screenEdgeScrollEventHandler );
	
	return PublicAccess;

})( window, Events );
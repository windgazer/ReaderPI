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
		scrollTracker, isEdgeX, atEdgeLeft, atEdgeRight, isEdgeY, atEdgeTop, atEdgeBottom, isVertical, wheelData, hasFired,
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


	function getDimension( e, d ){

		return ( e.touches?e.touches[0]:e )["page" + d];

	}

	function getX( e ) {

		return getDimension( e, "X" );

	}

	function getY( e ){

		return getDimension( e, "Y" );

	}

	function getMousePosition ( e ) {

		return { x:getX( e ),y:getY( e ) };

	}

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

		if ( body === null ) body = document.getElementsByTagName("body")[0];
		if ( debug === null ) debug = ( Options && Options.isDebug() )?true:false;

		scrollTracker = { x: 0, y: 0, vert: true, velocity: 0, t: 0 };
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
	
	function checkEdges( recheck ) {


		var	atEdgeLeftNow   = window.scrollX <= 0,
			atEdgeRightNow  = body.clientWidth + window.scrollX > body.scrollWidth,
			atEdgeTopNow    = window.scrollY <= 0, //Might need small grace-area (due to 'bounce' in some browser UI's)
			atEdgeBottomNow = body.clientHeight + window.scrollY >= body.scrollHeight;
		

		if ( recheck ) { //First run

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

		var e = e ? e : window.event; //In case IE start supporting these standards, or even already does :)
		wheelData    = e.detail ? e.detail * -1 : e.wheelDelta / 30;

		checkEdges( resetTimer !== null );

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

			}
			
			if ( atEdgeBottom && wheelData < -3 ) {

				hasFired = true;
				console.log("BOTTOM-EDGE SWIPE");
				var ha = handlers[ PublicAccess.EDGE_EVENT_BOTTOM ];
				for ( var i = 0, l = ha.length; i < l; i++ ) {

					ha[ i ]( );

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
	 * Handler to process scroll-based events.
	 */
	function screenEdgeScrollEventHandler( e ) {
		
		prepScrollData( e );
		
		determineEventResolution();

		scrollTracker = { x: window.scrollX, y: window.scrollY, vert: isVertical, velocity: wheelData };

	}

	/**
	 * This handler should start the touch-events.
	 */
	function touchStartHandler( e ) {
		
		Console.log("Attempting to track touch movement");

		resetData( );
		//Figure out starting data...
		checkEdges( false );

		var position = getMousePosition( e );
		scrollTracker = { x: position.x, y: position.y, vert: false, velocity: 0, t: new Date().getTime() };

	}

	/**
	 * This handler should monitor the touch-events.
	 */
	function touchMoveHandler( e ) {

		Console.log("Attempting to deciver touch movement");

		//Double-check if we're still at the edges...
		checkEdges( true );
		var now      = new Date().getTime(),
			interval = now - scrollTracker.t,
			position = getMousePosition( e ),
			offsetX  = position.x - scrollTracker.x, //Negative for right-edge (right-to-left swipe)
			offsetY  = position.y - scrollTracker.y; //Negative for bottom-edge (down-to-up swipe)

		isVertical = Math.abs(offsetY) > Math.abs(offsetX);
		
		//80px in 1 second should be approximately 3 in velocity
		if ( isVertical ) {

			wheelData = ( offsetY / interval ) * 35;

		} else {

			wheelData = ( offsetX / interval ) * 35;

		}
		
		if ( 
				(((atEdgeTop && isVertical) || (atEdgeLeft && !isVertical)) && wheelData > 0)
				 ||
				(((atEdgeRight && !isVertical) || (atEdgeBottom && isVertical)) && wheelData < 0)
		) {
			return Events.cancel( e ); //Attempting to prevent default action if we're already at the edge and scrolling beyond
		}

	}

	/**
	 * This handler should finalise the touch-events.
	 */
	function touchEndHandler( e ) {

		Console.log("Finishing to deciver touch movement");

		//Check if we're still on the edge and with enough velocity...
		determineEventResolution( );
		resetData( );

	}

	/**
	 * This method blocks some annoying default actions that we prefer not to happen :)
	 * 
	 */
	function blockDefaultActions( ) {

		resetData( );

		var b = document.getElementsByTagName( "body" )[0],

			handler = function( e ) {

				return Events.cancel( e );
	
			};
		
		Events.attach( b, "selectstart", handler );
		
		Events.attach( b, "dragstart", handler );

	}

	Events.attach( window, "mousewheel", screenEdgeScrollEventHandler );
	Events.attach( window, "DOMMouseScroll", screenEdgeScrollEventHandler );
	Events.attach( window, "touchstart", touchStartHandler );
	Events.attach( window, "touchmove", touchMoveHandler );
	Events.attach( window, "touchend", touchEndHandler );
	
	Events.attach( window, "load", blockDefaultActions );
	
	return PublicAccess;

})( window, Events );
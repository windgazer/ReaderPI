/**
 * Swipelib aims to provide some nice and easy ways of working with swipe on touch UI's.
 * It aims not to need anythings along the lines of jQuery, MooTools, etc. Mostly due
 * to this lib being aimed at mobile devices and as such trying to stay bloatfree ;).
 * 
 * Having said that, it does need to listen to some events and as such will attempt to
 * be compatible with the bloat-ware, just to keep you from needing to ad my own
 * events script in favor of something you might already be using anyway...
 * 
 * @author Martin 'Windgazer' Reurings
 * @fileoverview
 */
(function() {
	
	/**
	 * Attempt to find a valid event-attaching method. This method is expected to
	 * return a function that takes the same arguments as my own Events lib. This
	 * is also, coincedentally the same as the W3C spec.
	 * {Object} element, {String} type, {function} handler
	 * 
	 * jQuery seems similar enough to cope with this and currently I don't care
	 * much about other libs :) This code will remain untested for now, as I don't
	 * much care for jQuery either...
	 */
	function getEventAttachMethod() {
		if (Events && Events.attach) return function(element, type, handler) {
			Events.attach(element, type, handler);
		};
		Events.attach(element, type, handler);
		if (jQuery) {
			//Assuming 1.7 or up...
			return function(element, type, handler) {
				jQuery(element).on(type, handler);
			};
		}
	}
	
	/**
	 * Prep the doc for use with swipe and such. This means a global mouseup handler,
	 * just in case. 
	 */
	function setupGlobals() {
		var b = document.getElementsByTagName( "body" )[0];
		attach( b, "mouseup", stops );
		attach( b, "touchend", stops );
	}
	
	var attach = getEventAttachMethod();

	var SwipeLib = {
		LEFT:1,
		RIGHT:2,
		scrollTimeOut:750,
		/**
		 * Attach a swipe event handler to an element. Swipes can be of type SwipeLib.LEFT,
		 * or SwipeLib.RIGHT.
		 */
		attach:function( element, type, handler ) {
	
			var type = type||this.LEFT|this.RIGHT;
			var self = this;
			function moves( e ) {
				if ( self.swiping ) {
					self.recordSwipeEvent( e, element );
					return Events.cancel( e );
				}
			}
			function starts( e ) {
				self.swiping = true;
				self.startSwipeEvent( e, element );
			}
			function stops( e ) {
				self.swiping = false;
				self.stopSwipeEvent( e, element, type, handler );
			}
	
			attach( element, "mousedown", starts );
			attach( element, "touchstart", starts );
			attach( element, "touchmove", moves );
			attach( element, "mousemove", moves );
	
		},
	
		getDimension:function( e, d ){
	
			var body = document.documentElement||document.body;
			return ( e.touches?e.touches[0]:e )["page" + d];
	
		},
	
		getX:function( e ) {
	
			return this.getDimension( e, "X" );
	
		},
	
		getY:function( e ){
	
			return this.getDimension( e, "Y" );
	
		},
	
		getMousePosition:function( e ) {
	
			return { x:this.getX( e ),y:this.getY( e ) };
	
		},
	
		startSwipeEvent:function( e, element ) {
	
			element.startSwipe = this.getMousePosition( e );
			element.startSwipe[ "time" ] = new Date( );
			element.startSwipe[ "source" ] = element;
	
		},
	
		recordSwipeEvent:function( e, element ) {
	
			var p = this.getMousePosition( e );
			element.lastSwipe = p;
	
		},
	
		stopSwipeEvent:function( e, element, type, handler ) {
	
			var start = element.startSwipe;
	
			if ( start ) {
	
				var end = element.lastSwipe||this.getMousePosition( e );
				end[ "time" ] = new Date();
				end[ "target" ] = element;
				var horizontal = start.x - end.x;
				var vertical = Math.abs( start.y - end.y );
				var velocity = Math.abs( horizontal ) / ( end.time.getTime( ) - start.time.getTime( ) );
	
				if ( horizontal > 50 && vertical < 25 ) {
	
					if ( type&SwipeLib.LEFT ) {
						handler( e, velocity, SwipeLib.LEFT, start, end );
					}
	
				}
				if ( horizontal < -50 && vertical < 25 ) {
	
					if ( type&SwipeLib.RIGHT ) {
						handler( e, velocity, SwipeLib.RIGHT, start, end );
					}
	
				}
	
			}
	
		},
		
		blockDefaultActions: function( el ) {
	
			var b = el || document.getElementsByTagName( "body" )[0],
				self = this,
				handler = function( e ) {
			
					if ( self.swiping ) {
						return Events.cancel( e );
					}
					
					return true;
		
				};
			
			attach( b, "selectstart", handler );
			
			attach( b, "dragstart", handler );
	
		}
	
	};

	//Expose to the window scope so it can be accessed from 'outide'
	this.SwipeLib = SwipeLib;

})();
/**
 * SwipeEvents is supposed to be a singleton type 'class' that provides an easy
 * implementation for setting up swipe events, without the need of an overkill
 * type library like jQuery...
 * 
 * @author Martin 'Windgazer' Reurings
 * @class
 */
var SwipeEvents = {
	LEFT:1,
	RIGHT:2,
	scrollTimeOut:750,
	/**
	 * Attach a swipe event handler to an element. Swipes can be of type SwipeEvents.LEFT,
	 * or SwipeEvents.RIGHT.
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

		Events.attach( element, "mousedown", starts );
		Events.attach( element, "touchstart", starts );
		Events.attach( element, "mouseup", stops );
		Events.attach( element, "touchend", stops );
		Events.attach( element, "touchmove", moves );
		Events.attach( element, "mousemove", moves );

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

				if ( type&SwipeEvents.LEFT ) {
					handler( e, velocity, SwipeEvents.LEFT, start, end );
				}

			}
			if ( horizontal < -50 && vertical < 25 ) {

				if ( type&SwipeEvents.RIGHT ) {
					handler( e, velocity, SwipeEvents.RIGHT, start, end );
				}

			}

		}

	},
	
	blockDefaultActions: function( ) {

		var b = document.getElementsByTagName( "body" )[0],
			self = this,
			handler = function( e ) {
		
				if ( self.swiping ) {
					return Events.cancel( e );
				}
				
				return true;
	
			};
		
		Events.attach( b, "selectstart", handler );
		
		Events.attach( b, "dragstart", handler );

	}

};

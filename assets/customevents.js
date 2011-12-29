(function(){
	
	var registry = [];

	function CustomEvents () {
		var now = new Date();
		this.id = "ce" + now.getTime();
		registry[this.id] = [];
	};
	
	CustomEvents.prototype = {

		fireEvent: function( eid, eInfo ) {

			var reg = registry[ this.id ];
			if ( reg ) {

				var handlers = reg[ eid ];
				if ( handlers ) {

					for ( var i = 0; i < handlers[ i ]; i++ ) {

						handlers[ i ]( eid, eInfo, this.id );

					}

				}

			}

		},
		
		attachEvent: function ( eid, handler ) {

			var reg = registry[ this.id ];
			
			if ( reg === null || typeof reg === "undefined" ) {

				reg = [];
				registry[ this.id ] = reg;

			}
			
			var handlers = reg[ eid ];

			if ( handlers === null || typeof handlers === "undefined" ) {

				handlers = [];
				reg[ eid ] = handlers;

			}
			
			handlers.push( handler );

		}

	};
	
	window.ce = new CustomEvents();

})();
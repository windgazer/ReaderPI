(function(){
	
	var registry = [];

	function CustomEvents () {
		var now = new Date();
		this.id = "ce" + now.getTime();
		registry[this.id] = [];
	};
	
	CustomEvents.prototype = {

		fireEvent: function( eid, eInfo ) {
			
			Console.log("Firing '" + eid + "' event.")

			var reg = registry[ this.id ];
			if ( reg ) {

				var handlers = reg[ eid ];
				if ( handlers ) {

					for ( var i = 0; i < handlers.length; i++ ) {

						handlers[ i ]( eid, eInfo, this.id );
						Console.info(handlers[ i ], eInfo, this.id, eid, i);

					}

				}

			}

		},
		
		attachEvent: function ( eid, handler ) {

			Console.log("Attaching '" + eid + "' event.")

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
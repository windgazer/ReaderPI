(function() {
	nl_windgazer_debug = true;
	nl_windgazer_console = {
		log:function(message) {
			//Just dumping the message into the void :)
		},
		warn:function(message) {
			//Just dumping the message into the void :)
		},
		info:function(message) {
			//Just dumping the message into the void :)
		}
	};
	this.console = this.console||nl_windgazer_console;
	
	this.Console = nl_windgazer_debug?this.console:nl_windgazer_console;
})();

(function(){
	
	var registry = [];

	function CustomEvents () {
		var now = new Date();
		this.id = "ce" + now.getTime();
		registry[this.id] = [];
	};
	
	CustomEvents.prototype = {

		fireEvent: function( eid, eInfo ) {
			
			Console.log("Firing '" + eid + "' event.", eid, eInfo);

			var reg = registry[ this.id ];
			if ( reg ) {

				var handlers = reg[ eid ];
				if ( handlers ) {

					for ( var i = 0; i < handlers.length; i++ ) {

						handlers[ i ]( eid, eInfo, this.id );
						if ( Options.isDebug() ) Console.info(handlers[ i ], eInfo, this.id, eid, i);

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
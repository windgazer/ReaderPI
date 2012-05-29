(function(){

	LinkListener.addHandler("authVerify", function( e ) {

		console.log("Authenticate User");
		var user = document.getElementById("auth-uid").value;
		var pwd = document.getElementById("auth-pwd").value

		DeliciousAPI.authenticate( user, pwd );
		window.ce.fireEvent( Constants.ON_AUTH_SUCCESS, Settings );

		window.location.replace( document.getElementById("authenticationForm").action );
		return Events.cancel(e);

	});
	
	LinkListener.addHandler("authCancel", function( e ) {

		var e = e||window.event;

		console.log( "Disabling online storage" );
		Settings.setPreference("online-storage", false);
		window.ce.fireEvent( Constants.ON_AUTH_SUCCESS, Settings );

		window.location.replace( document.getElementById("authenticationForm").action );
		return Events.cancel(e);

	});
	
	window.ce.attachEvent( Constants.ON_AUTH_REQUIRED, function( eid, settings ) {

		Console.log( "Opening auth dialog!" );
		window.location.replace( "#auth" );

	} );

})();
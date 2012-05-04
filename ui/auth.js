(function(){

	LinkListener.addHandler("authVerify", function() {
		console.log("Authenticate User");
		var user = document.getElementById("auth-uid").value;
		var pwd = document.getElementById("auth-pwd").value
		DeliciousAPI.authenticate( user, pwd );
		window.ce.fireEvent( ON_AUTH_SUCCESS, Settings );
		return true;//Don't block href navigation
	});
	
	LinkListener.addHandler("authCancel", function() {
		//TODO Disable online storage
		console.log( "Disabling online storage" );
		Settings.setPreference("online-storage", false);
		window.ce.fireEvent( ON_AUTH_SUCCESS, Settings );
		document.getElementById("authenticationForm").submit();
		return true;
	});
	
	window.ce.attachEvent( this.ON_AUTH_REQUIRED, function( eid, settings ) {

		Console.log( "Opening auth dialog!" );
		window.location.href = "#auth";

	} );

})();
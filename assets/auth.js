(function(){

	LinkListener.addHandler("authVerify", function() {
		alert("Authenticate User");
		return false;//Don't block href navigation
	});
	
	LinkListener.addHandler("authCancel", function() {
		//TODO Disable online storage
		return false;
	});

})();
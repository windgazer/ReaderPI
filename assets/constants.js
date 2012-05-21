(function(){

	window.Constants = {
	
		  COMIC_FETCH_INPROGRESS	: "nl.windgazer.FetchingEntry"
	
		, COMIC_FINISHED_LOADING	: "nl.windgazer.ComicImageOnLoad"
	
		, COMIC_EVENT_ID			: "nl.windgazer.EntryReceived"
		
		, COMIC_FETCH_FAILED		: "nl.windgazer.FetchingFailed"

		/**
		 * Authentication listeners are setup correctly, UI can commence.
		 */
		, ON_AUTH_READY : "onAuthReady"

		/**
		 * Authentication was successful, UI can start requesting/storing data.
		 * Also fires when no auth is required (automatic success...)
		 */
		, ON_AUTH_SUCCESS : "onAuthSuccess"

		/**
		 * Authentication required
		 */
		, ON_AUTH_REQUIRED : "onAuthRequired"

		/**
		 * Error in authentication, something is attempting access but authentication
		 * has not been processed...
		 */
		, ON_AUTH_ERROR : "onAuthError"

		/**
		 * Authentication process was requested, but user canceled.
		 */
		, ON_AUTH_CANCELED : "onAuthError"

	}

})();
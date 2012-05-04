if ( typeof nl === "undefined" ) { nl = {}; }; if ( typeof nl.windgazer === "undefined" ) {  nl.windgazer = {}; };

( function( domain ) {
	
	domain.EntryProps = ["title", "imgURL", "currentURL", "prevURL", "nextURL", "comic"];

	domain.Entry = function( props ) {
		
		this.props = props;

	};	

	domain.Entry.prototype = {

		get: function( n ) {

			return this.props[ n ];

		},
		
		getTitle : function (  ) {

			return this.props.title;

		},

		getCurrentURL: function (  ) {

			return this.props.currentURL;

		},

		getImgURL: function(  ) {

			return this.props.imgURL;

		},

		getPrevURL: function(  ) {

			return this.props.prevURL;

		},

		getNextURL: function(  ) {

			return this.props.nextURL;

		},

		getComic: function(  ) {

			return this.props.comic;

		}

	};

} )( nl.windgazer );
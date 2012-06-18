(function(){
	var Powernap = new nl.windgazer.YQLComic(
		(943<<16) + 10,
		"Powernap"
		, "http://www.powernapcomic.com/"
		, "//img[contains(@src, \"2011/pnap\")]|//img[contains(@src, \"prev\") or contains(@src, \"next\")]/.."
		, {
			/**
			 * Sorting entry url versus link,  if the first one is the link, it's a previous link :)
			 */
			getLinkIsPrev: function( link, url, comic ) {
				//No request params means latest comic and link is then always to previous...
				if (url.indexOf("/d/") < 1) return true;
				
				//Else sort current url versus the link...
				var urls = [url, link.href];
				urls.sort();
				
				//if url does not equal the first link after sort, the link is to previous comic...
				var isPrev = url != urls[0];
				return isPrev;
			}
		}
	);
	
	Comics.addComic(Powernap.getId(), Powernap);
})();
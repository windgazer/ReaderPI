(function(){
	var OOTS = new nl.windgazer.YQLComicFromStart(
		(943<<16) + 11,
		"Order of the Stick"
		, "http://www.giantitp.com/comics.this_is_just_a_placeholder_to_quickfix_some_code/.."
		, "//img[contains(@src, \"/comics/\")]|//td[contains(@width, \"80\")]//img[contains(@src, \"Back\") or contains(@src, \"Next\") or contains(@src, \"Latest\")]/.."
		, "http://www.giantitp.com/comics/oots0001.html"
	);
	
	Comics.addComic(OOTS.getId(), OOTS);
})();
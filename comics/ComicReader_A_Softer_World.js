(function(){
	var ASofterWorld = new nl.windgazer.YQLComic(
		(943<<16) + 6,
		"A Softer World"
		, "http://www.asofterworld.com/"
		, "//*[contains(@*,\"thecomic\")]//img[1]|//*[contains(@*, \"back\") or contains(@*, \"next\")]//a"
	);
	
	Comics.addComic(ASofterWorld.getId(), ASofterWorld);
})();
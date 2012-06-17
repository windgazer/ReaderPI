(function(){
	var OctopusPie = new nl.windgazer.YQLComic(
		(943<<16) + 8,
		"Octopus Pie"
		, "http://www.octopuspie.com/"
		, "//img[contains(@src, \"strippy\")]|//a[contains(@rel, \"prev\") or contains(., \"Prev\") or contains(@*, \"prev\") or contains(@rel, \"next\") or contains(., \"Next\") or contains(@*, \"next\")][1]"
	);
	
	Comics.addComic(OctopusPie.getId(), OctopusPie);
})();
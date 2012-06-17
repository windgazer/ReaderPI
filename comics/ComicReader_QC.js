(function(){
	var QC = new nl.windgazer.YQLComic(
		(943<<16) + 9,
		"Questionable Content"
		, "http://questionablecontent.net/"
		, "//img[contains(@src, \"comics\")]|//a[contains(@rel, \"prev\") or contains(., \"Prev\") or contains(@*, \"prev\") or contains(@rel, \"next\") or contains(., \"Next\") or contains(@*, \"next\")][1]"
	);
	
	Comics.addComic(QC.getId(), QC);
})();
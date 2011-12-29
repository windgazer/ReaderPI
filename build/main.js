/**
 * Run this file from command-line as follows:
 * java -jar jsrun.jar run.js -t index.html
 * 
 */
function main(args) {

	//Set up paths	
	var buildDir = new FilePath( SYS.pwd );
	var homeDir = buildDir.upDir();
	var outDir = new FilePath( homeDir.toDir().toString() + "output/" );
	
	//Set up file
	var concat = new File( outDir.toDir().toString() + "app.js" );
	concat.getParentFile().mkdirs();
	if ( concat.exists() ) concat["delete"]();
	concat.createNewFile();
	//Set up writer
	var writer = new Packages.java.io.FileWriter(concat);

	//for ( var i = 0; i < args.length; System.out.println( args[ i++ ] ) );
	//System.out.println( homeDir.toDir().toString() );

	//Read template file	
	var inpFileName = homeDir.toDir().toString() + args[1];
	//Grab src paths from template
	var srcs = findAssetSources(  readFile( inpFileName ), SCRIPT_SRC_RE, SCRIPT_SRC_RPL );
	//Write all to file
	concatToWriter( srcs.o, homeDir, writer, processRawJS );
	//And to finish up, close the stream to empty the buffer	
	writer.close();

	//Read in concatted JS	
	var concatStr = readFile( concat.getAbsolutePath() );
	//Base64 encode JS
	var b64Str = Base64.encode( concatStr );
	//TODO: Replace app.js reference with b64Str as data param
	//System.out.println( b64Str );
	srcs.s = srcs.s.replace("app.js", "data:text/javascript;base64," + b64Str);

	//Find style sources
	var srcs = findAssetSources(  srcs.s, STYLE_SRC_RE, STYLE_SRC_RPL );
	//Set up file
	var concCSS = new File( outDir.toDir().toString() + "app.css" );
	if ( concCSS.exists() ) concCSS["delete"]();
	concCSS.createNewFile();
	//Set up writer
	writer = new Packages.java.io.FileWriter(concCSS);
	concatToWriter( srcs.o, homeDir, writer );
	//Empty buffer
	writer.close();

	//Read in concatted CSS	
	var concCSSStr = readFile( concCSS.getAbsolutePath() );
	//Base64 encode JS
	var b64CSSStr = Base64.encode( concCSSStr );
	//TODO: Replace app.css reference with b64Str as data param
	//System.out.println( b64CSSStr );
	srcs.s = srcs.s.replace("app.css", "data:text/css;base64," + b64CSSStr);

	//create file
	var app = new File( outDir.toDir().toString() + "app.html" );
	if ( app.exists() ) app["delete"]();
	app.createNewFile();
	//create writer
	writer = new Packages.java.io.FileWriter(app);
	//write out new app
	writer.write( srcs.s );
	//Empty buffer
	writer.close();

}


var SCRIPT_SRC_RE = /\n\s*<script\s+src="([^"]+)"><\/script>/gi;
var SCRIPT_SRC_RPL = "<script src=\"app.js\"><\/script>";
var STYLE_SRC_RE = /\n\s*<link type="text\/css" rel="stylesheet" href="([^"]+)"\s?\/?>/gi;
var STYLE_SRC_RPL = "<link type=\"text/css\" rel=\"stylesheet\" href=\"app.css\" />";


/**
 * Search for set of links to a specified resource type and removes those references.
 * @argument {String} inp The input String containing the links
 * @argument {RegExp} re A regular expression that matches the resource links with the 1st group matching the link
 * @argument {String} repl The replacement for the very first resource reference found. 
 * @return {JSON} A JSON-Object with .o containing an array of resource-links, and .s containing the modified source.
 */
function findAssetSources( inp, re, repl ) {

	var o = [],
	    m = null,
	    s = "",
	    preIndex = 0;

	while ( m = re.exec( inp ) ) {

	  s += RegExp.leftContext.substr( preIndex );
	  o.push( m[1] );

	  if ( preIndex == 0 ) s += repl;
	  preIndex = re.lastIndex;

	}
	s += RegExp.rightContext;

	return {o:o,s:s};

}


/**
 * Concatenate files to a writer, optionally processing the contents of the file
 * before writing it out to the writer.
 * 
 * @argument {String[]} files An Array of file-links
 * @argument {Writer} writer A file-writer to which to write out the files
 * @argument {function} postProcess An optional function to post-process the file-contents before appending.
 */
function concatToWriter( files, homeDir, writer, postProcess ) {

	//Render the paths to a single concatenated file.
	for (var i = 0; i < files.length; i++ ) {

		System.out.println( files[i] );
		var srcStr = readFile( homeDir.toDir().toString() + files[ i ] );
		if (postProcess) {
			srcStr = postProcess( srcStr );
		}
		appendFile  ( writer, srcStr );

	}

}


/**
 * Process a Javascript String to strip certain simple commentary and white-space to
 * minify the JS code.
 * 
 */
function processRawJS( str ) {

	return ";" + str
			.replace( /\r\n/g, "\n" )
			.replace( /(\/\*+(\n\s+\*(?!\/).*)*\n\s+\*+\/\s*\n)/g, "" )
			.replace( /(^|\n)\s*\/\/[^\n]+/g, "" )
			.replace( /(\n|\s)\s+/g, "$1" );

}


function appendFile( writer, str ) {

	writer.write( str );

}


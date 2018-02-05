
/**
 * Asap.Url 
 *
 * Represent an URL formated 
 * It is used to transform a classic href to a formatted url. 
 * It deal with cross-domain, relative, absolute url
 *
 * @constructor 
 * @param {String} href The href attribute of Asap.Link element 
 */
Asap.Url = function(href){

	this.href = href;	// (string) Href attribute
	this.value = null;	// (string) Url formated
	this.valid = true;	// (boolean) 
		
	this.format();
}


Asap.Url.prototype = {

	/**
	 * List of availables status
	 */
	types: {
		RELATIVE: 1,
		ABSOLUTE: 2,
		ROOT: 3,
		CROSSDOMAIN: 4,
		UNDEFINED: 5 // mailto, javascript, ftp, file, tel, has
	},


	/**
	 * List of regexp used in different case
	 */
	regexp: {
		relative: /^(?:\.+?\/|[\w\.]+$)/,		// ex : ./test/index.html || ../../test.css || index.html
		root: /^\/.+?$/,						// ex : /test/test.html
		dir: /\/$/,								// ex : https://test.com/test/
		fileOrDir: /\/([\w\.]+)?$/, 			// ex : https://test.com/test/index.html || https://test.com/test/
		url: /https?:\/\/(?:((?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}|localhost))\b[-a-zA-Z0-9@:%_\+.~#?&\/=]*/i
	},


	/**
	 * Format a relative path in url
	 * ex : './path/to/something'
	 * @return void
	 */
	formatRelative: function(){
		var base = document.location.href;

		// If current url is a path to a file or a dir
		if( base.match( this.regexp.fileOrDir ) ){
			base = base.replace(this.regexp.fileOrDir, "/");
		}

		this.value = base + this.href; 
		this.type = this.types.RELATIVE;
	},


	/**
	 * Format a absolute path in url
	 * ex : '/path/to/something/else'
	 * @return void
	 */
	formatAbsolute: function(){
		var base = document.location.origin;
		this.value = base + this.href; 
		this.type = this.types.ROOT;
	},


	/**
	 * Format a full url and check Cross-Domain url
	 * @return void
	 */
	formatUrl: function(){
		var urlMatch = this.href.match(this.regexp.url);

		// match 1 represent host 
		if( urlMatch[1] && urlMatch[1] == document.location.host ){
			this.value = this.href;
			this.type = this.types.ABSOLUTE;
		} else {
			this.type = this.types.CROSSDOMAIN;
			this.valid = false;
		}
	},


	/**
	 * Main function which match the good url pattern and format it
	 * @return void
	 */
	format: function(){

		// If href is a relatif path
		if( this.href.match( this.regexp.relative ) ){ 
	
			this.formatRelative();
		
		// If href is a absolute path
		} else if( this.href.match( this.regexp.root )){  
			
			this.formatAbsolute();

		// If href is a full url
		} else if (this.href.match( this.regexp.url )) { 

			this.formatUrl();

		// undefined, we don't care 
		} else { 

			this.type = this.types.UNDEFINED
			this.valid = false;

		}
	}
}


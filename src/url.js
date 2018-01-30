Asap.Url = function(href){

	this.href = href;	
	this.value = null;
	
	 
	if( this.href.match( this.regexp.relative ) ){ // If href is a relatif path
	
		var base = document.location.href;

		// If current url is a path to a file or a dir
		if( base.match( this.regexp.fileOrDir ) ){
			base = base.replace(this.regexp.fileOrDir, "/");
		}
		this.value = base + this.href; 
		this.type = this.types.RELATIVE;

	
	} else if( this.href.match( this.regexp.root )){  // If href is a absolute path
		
		var base = document.location.origin;
		this.value = base + this.href; 
		this.type = this.types.ROOT;
	
	} else if (href.match( this.regexp.url )) { // If href is a full url

		this.value = this.href; 
		this.type = this.types.ABSOLUTE;

	} else { // we don't care 

		this.type = this.types.UNDEFINED

	}
}


Asap.Url.prototype = {

	regexp: {
		relative: /^(?:\.+?\/|[\w\.]+$)/,		// ex : ./test/index.html || ../../test.css || index.html
		root: /^\/.+?$/,						// ex : /test/test.html
		dir: /\/$/,								// ex : https://test.com/test/
		fileOrDir: /\/([\w\.]+)?$/, 			// ex : https://test.com/test/index.html || https://test.com/test/
		url: /((https?|ftp):\/\/)?([a-z0-9+!*(),;?&=$_.-]+(:[a-z0-9+!*(),;?&=$_.-]+)?@)?([a-z0-9\-\.]*)\.(([a-z]{2,4})|([0-9]{1,3}\.([0-9]{1,3})\.([0-9]{1,3})))(:[0-9]{2,5})?(\/([a-z0-9+$_%-]\.?)+)*\/?(\?[a-z+&\$_.-][a-z0-9;:@&%=+\/$_.-]*)?(#[a-z_.-][a-z0-9+$%_.-]*)?/
	},

	types: {
		RELATIVE: 1,
		ABSOLUTE: 2,
		ROOT: 3,
		UNDEFINED: 4 // mailto, javascript, ftp, file, tel, has
	}

}
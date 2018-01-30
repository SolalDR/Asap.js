Asap.Response = function(response){
	this.content = response;
	this.status = 200;
	this.parse();
}


Asap.Response.prototype = {
	
	parse: function(){

		this.parser = new DOMParser();
		this.contentParsed = this.parser.parseFromString(this.content, "text/html");

	}

}
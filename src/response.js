Asap.Response = function(response){
	this.content = response;
	this.status = 200;
	this.parse();
}


Asap.Response.prototype = {
	
	parse: function(){

		this.parser = new DOMParser();
		this.contentParsed = this.parser.parseFromString(this.content, "text/html");

		document.body = this.contentParsed.body;
		Asap.addLinks(document.body);

		document.dispatchEvent(Asap.events.load);
		var scripts = document.body.querySelectorAll("script");
		for(var i=0; i<scripts.length; i++){
			eval(scripts[i].innerHTML);
		}

	},

	evaluate: function(){

	}

}
Asap.Visit = function(link){
	var self = this;
	this.request = new Asap.Request(link.url)
	
	this.request.on("success", function(e){
		self.response = new Asap.Response(e.response);
	});

	Asap.requests.push(this.request);
}


window.onload = function(){
	Asap.start();
}
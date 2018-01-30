Asap.Visit = function(link){
	var self = this;
	this.link = link;
	this.target = null; 
	this.source = null;
	this.request = new Asap.Request(link.url);

	this.initParameters();

	this.request.on("success", function(e){
		self.onRequestSuccess(e.response);
		Asap.requests.push(self.request);
	});
}


Asap.Visit.prototype = {

	onRequestSuccess: function(response){
		this.response = new Asap.Response(response);

		var state = {
			title: document.querySelector("title").innerHTML,
			body: document.body.innerHTML,
			animation: this.params.animationName,
			date: Date.now()
		};

		this.updateBody();
		this.updateHead();

		window.history.pushState(state, "Asap", this.link.url.value);
		console.log(state);

		Asap.evaluateScripts(this.source);

		document.dispatchEvent(Asap.events.load);
	},

	queryTarget: function(){
		if( this.params.targetSelector ){
			this.target = this.response.contentParsed.body.querySelector(this.params.targetSelector);
			if( !this.target ) {
				console.warn("Asap : Selector data-target was not valid, \""+this.params.targetSelector+"\" has been replace by \"body\"");
			}
		}
		if( !this.target ) this.target = this.response.contentParsed.body;
	},

	querySource: function(){
		if( this.params.sourceSelector ){
			this.source = document.querySelector(this.params.sourceSelector); 
			if( !this.source ) {
				console.warn("Asap : Selector data-source was not valid, \""+this.params.sourceSelector+"\" has been replace by \"body\"");	
			} 
		}
		if( !this.source ) this.source = Asap.defaultTarget; 
	},

	updateBody: function(){
		
		this.queryTarget();
		this.querySource();

		this.source.innerHTML = this.target.innerHTML;

		Asap.addLinks(this.source);
	},

	updateHead: function(){
		document.querySelector("title").innerHTML = this.response.contentParsed.querySelector("title").innerHTML;
	},

	initParameters: function(){
		this.params = {
			sourceSelector: this.link.source,
			targetSelector: this.link.target,
			animationName: this.link.animation
		}
	}

}


window.onload = function(){
	Asap.start();
}
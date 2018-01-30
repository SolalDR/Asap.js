Asap.Link = function(node){
	this.link = node;
	this.source = null;
	this.animation = null;
	this.target = null;

	// If the link has been visited before
	this.visits = [];

	this.init();
}


Asap.Link.prototype = {

	onVisit: function(event){
		this.visits.push(new Asap.Visit(this));
		if( this.url.type !== this.url.types.UNDEFINED ) event.preventDefault();
	},
	
	init: function(){
		this.link.addEventListener("click", this.onVisit.bind(this));
		this.url = new Asap.Url(this.link.getAttribute("href"));		
		
		if(this.link.getAttribute("data-source")) this.source = this.link.getAttribute("data-source");
		if(this.link.getAttribute("data-target")) this.target = this.link.getAttribute("data-target");
		if(this.link.getAttribute("data-animation")) this.animation = this.link.getAttribute("data-animation");
	}

}








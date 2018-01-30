Asap.Link = function(node){
	this.link = node; 					// Node
	this.visits = [];					// If the link has been visited before
	this.target = Asap.defaultTarget; 	// Target of the links (Set in Link attributes) [Node] 
	this.animation = null;				// Animation on request callback (Set in Link attributes) [Asap.Animation]
	this.callback = null;
	this.init();
}


Asap.Link.prototype = {

	get visited() {
		return this.visits.length > 0 ? true : false; 
	},

	onVisit: function(event){
		this.visits.push(new Asap.Visit(this));
		if( this.url.type !== this.url.types.UNDEFINED ) event.preventDefault();
	},
	
	init: function(){
		this.link.addEventListener("click", this.onVisit.bind(this));
		this.srcSelector = this.link.getAttribute("data-source") ? this.link.getAttribute("data-source") : document.body;
			
		if(this.link.getAttribute("data-target") && document.querySelector(this.link.getAttribute("data-target")))
			this.target	= document.querySelector(this.link.getAttribute("data-target"));

		this.url = new Asap.Url(this.link.getAttribute("href"));
	}

}


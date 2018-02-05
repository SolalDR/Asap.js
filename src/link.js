
/**
 * Asap.Link represent an html link. 
 * It is used to instantiate new Asap.Visit on click and manage special attributes
 * @constructor 
 * @param {Node} node The <a> element 
 */
Asap.Link = function(node){
	this.link = node;

	this.source = null;
	this.animation = null;
	this.target = Asap.config.selector.target;
	this.nativeTarget = "_self";

	// If the link has been visited before
	this.visits = [];

	this.initConfig();
	this.initEvents();
}


Asap.Link.prototype = {

	/**
	 * The list of availables attributes for HTML Element
	 */
	AVAILABLES: {
		source: "data-asap-source",
		target: "data-asap-target",
		animate: "data-asap-animate",
		off: "data-asap-off"
	},


	/**
	 * Click event
	 * @param {object} event 
	 */
	onVisit: function(event){
		this.visits.push(new Asap.Visit(this));
		if( this.url.type !== this.url.types.UNDEFINED ) {
			event.preventDefault();
		}
	},

	/**
	 * Manage html attributes
	 */
	initConfig: function(){
		if(this.link.getAttribute(this.AVAILABLES.source)) this.source = this.link.getAttribute(this.AVAILABLES.source);
		if(this.link.getAttribute(this.AVAILABLES.target)) this.target = this.link.getAttribute(this.AVAILABLES.target);
		if(this.link.hasAttribute(this.AVAILABLES.animate)) this.animation = true;
		if(this.link.hasAttribute(this.AVAILABLES.off)) this.enable = false;
		if(this.link.hasAttribute("target")) this.nativeTarget = this.link.getAttribute("target");
	},
	

	/**
	 * Init click events
	 */
	initEvents: function(){
		this.url = new Asap.Url(this.link.getAttribute("href"));		
		
		if( !this.enable && this.url.valid && this.nativeTarget === "_self" ){
			this.link.addEventListener("click", this.onVisit.bind(this));
		}
	}
}


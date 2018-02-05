
/**
 * @namespace
 * Asap.js core
 * run Asap.start() to launch listening
 */
var Asap = {


	/*********************** Config *********************/
	
	/*
	 *	Default configuration
	 */ 
	default: {
		selector: {
			target: "body",
			source: "body"
		},
		source: document.body
	},

	config: {},

	/*********************** Storage *********************/

	/* List of all the links in the dom [Asap.Link] */
	links: [], 

	/* List of all the current request  [Asap.Request]*/
	requests: [],

	/* Custom events list */
	events: {
		/* Dispatch when a new visit is end */
		load: new Event("asap:load", { "bubbles":false, "cancelable": true})
	},


	/**
	 * @constructor
	 * The future constructor of animation system
	 */
	Animation: function(){
		this.request;			// Referer request
		this.bemName;			// Block name of animation ["slide", "fade", "rotate"]
		this.status; 			// Start / Run / End
		this.callback; 			// On end
	},


	/*********************** History *********************/

	/**
	 * Push the current state to allow back history action 
	 */
	saveInitialState: function(){
		window.history.pushState({
			title: document.querySelector("title").innerHTML,
			body: document.body.innerHTML
		}, "Asap", document.location.href);
	},


	/**
	 * Restore a state
	 * @params {Object} state
	 */
	restoreFromState: function(state){
		document.title.innerHTML = state.title;
		document.body.innerHTML = state.body;
		Asap.evaluateScripts(document.body);
		Asap.addLinks(document.body);
	},


	/*********************** Helpers *********************/

	/**
	 * An helper method to facilitate Event implementation in objects
	 * @param {function} c : The object constructor
	 */
	implementEvent: function(c){
		var proto = Object.assign( {}, c.prototype);  			// Store originals proto
		c.prototype = AbstractEvent.prototype; 					// Implement events methods 
		c.prototype.constructor = c; 							// Override constructor
		c.prototype = Object.assign(c.prototype, proto); 		// Merge originals proto
	},

	
	/**
	 * Eval <script> content in source node,
	 * allow to launch specific scripts when a new visit is done 
	 * @param {Node} source  
	 */
	evaluateScripts: function(source){
		var scripts = source.querySelectorAll("script");
		for(var i=0; i<scripts.length; i++){
			eval(scripts[i].innerHTML);
		}
	},


	/**
	 * Instantiate an Asap.Link object for each link in the target node
	 * @param {Node} target 
	 */
	addLinks: function(target){
		var links = target.querySelectorAll("a");
		for(var i=0; i<links.length; i++){
			if( links[i].getAttribute("data-asap") !== "false" ){
				this.links.push(new Asap.Link(links[i]));
			}
		}
	},


	/*********************** Initialisation *********************/
	

	initConfig: function(c){

		this.config.selector = {};

		this.config.selector.target = c.targetSelector ? c.targetSelector : this.default.selector.target;

		
		if( c.sourceSelector ) {
			this.config.selector.source = c.sourceSelector;
			this.config.source = document.querySelector(this.config.selector.source);
		} else {
			this.config.selector.source = this.default.selector.source;
			this.config.source = this.default.source;
		}

		console.log(this.config.source);
	},


	/**
	 * Setup the global configuration, 
	 * get all the links in the page
	 * and init the listening
	 *
	 * @param {object} args : a configuration object
	 */
	start: function(args){
		var self = this;

		if( !args ){ var args = {} }

		this.initConfig(args);
		this.addLinks( document.body );
		
		window.onpopstate = function(event) {
			// console.log(window.history);
			self.restoreFromState(event.state);
		};
		this.saveInitialState();
	}
};


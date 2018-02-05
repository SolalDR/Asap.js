/*
 * DOMParser HTML extension
 * 2012-09-04
 * 
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * 
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
	"use strict";

	var proto = DOMParser.prototype, 
        nativeParse = proto.parseFromString;

	// Firefox/Opera/IE lancent des erreurs sur les types non pris en charge 
	try {
		// WebKit renvoie null sur les types non pris en charge 
		if ((new DOMParser()).parseFromString("", "text/html")) {
			// text/html l'analyse est supportée nativement 
			return;
		}
	} catch (ex) {}

	proto.parseFromString = function(markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {

			var doc = document.implementation.createHTMLDocument("");
      		if (markup.toLowerCase().indexOf('<!doctype') > -1) {
    			doc.documentElement.innerHTML = markup;
  			} else {
    			doc.body.innerHTML = markup;
  			}
			return doc;

		} else {

			return nativeParse.apply(this, arguments);

		}
	};
}(DOMParser));





/**
 * An abstract class which allow to implements events 
 * @author Solal Dussout-Revel https://github.com/SolalDR
 * @abstract
 */
function AbstractEvent () {
	this.events = {};
}

// Add a new function to execute when "name" is dispatch 
AbstractEvent.prototype.on = function(name, callback) {
	if (!this.events[name]) this.events[name] = [];
	this.events[name].push(callback.bind(this));
}

// Remove a function
AbstractEvent.prototype.off = function(name, callback){
	if (!this.events[name]) return;
	for (var i = 0; i < this.events[name].length; i++) {
		if( this.events[name][i] == callback ) this.events[name].splice(i, 1);
	}
}

// Dispatch the event, loop in this.events[name] and execute all the function in it
AbstractEvent.prototype.dispatch = function(name, event) {
	if (!this.events[name]) return;
	var callback;
	for (var i = 0; i < this.events[name].length; i++){
		callback = this.events[name][i];
		callback(event);
	}
}

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


Asap.Request = function(arg) {
	AbstractEvent.call(this);
	if (arg instanceof Asap.Url) {
		this.url = arg.value
	}

	this.opened = false;
	this.xhr = this.getXhrObject(); 	// XHR Request
	this.response = null; 				// Asap.Response
	this.target = document.body; 		// Target DOM
	this.complete = false;				// Request status
	this.send();
}


Asap.Request.prototype = Object.assign({}, AbstractEvent.prototype);
Asap.Request.prototype = Object.assign(Asap.Request.prototype, {

	getXhrObject: function(){
		if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}	else if(window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			console.log("Votre navigateur ne supporte pas les objets XMLHTTPRequest...");
			return;
		}
	},

	open: function(){
		var self = this;
		this.xhr.open("GET", this.url, true);
		this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		this.xhr.onreadystatechange = function() {
			if(this.readyState === 4 && this.status === 200) {
				var response = this.responseText;
				self.success = true;	
				self.dispatch("success", {
					response: response
				});
			}
		}
		this.opened = true;
		return this;
	},

	send: function() {
		if(!this.opened){
			console.warn("Objet XHR ouvert automatiquement");
			this.open();
		}
		this.xhr.send(null);
		return this;
	}
	
}); 


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
		if( !this.source ) this.source = Asap.config.source; 
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
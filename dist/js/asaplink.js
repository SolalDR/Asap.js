var Asap = {

	// The default target of all the request
	defaultTarget: document.body,

	// List of all the links in the dom [Asap.Link]
	links: [], 

	// List of all the current request  [Asap.Request]
	requests: [],


	events: {
		load: new Event("asap:load", { "bubbles":false, "cancelable": true})
	},

	Animation: function(){
		this.request;						// Referer request
		this.bemName;						// Block name of animation ["slide", "fade", "rotate"]
		this.status; 						// Start / Run / End
		this.callback; 						// On end
	},


	addLinks: function(target){
		var links = target.querySelectorAll("a");
		var link = null;
		for(var i=0; i<links.length; i++){
			if( links[i].getAttribute("data-asap") !== "false" ){
				link = new Asap.Link(links[i]); 
				this.links.push(link);
			}
		}
	},


	start: function(){
		this.addLinks(this.defaultTarget);
	}

};

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

AbstractEvent.prototype = {

	// Add a new function to execute when "name" is dispatch 
	on: function(name, callback) {
		if (!this.events[name]) this.events[name] = [];
		this.events[name].push(callback.bind(this));
	},

	// Remove a function
	off: function(name, callback){
		if (!this.events[name]) return;
		for (var i = 0; i < this.events[name].length; i++) {
			if( this.events[name][i] == callback ) this.events[name].splice(i, 1);
		}
	},

	// Dispatch the event, loop in this.events[name] and execute all the function in it
	dispatch: function(name, event) {
		if (!this.events[name]) return;
		var callback;
		for (var i = 0; i < this.events[name].length; i++){
			callback = this.events[name][i];
			callback(event);
		}
	}
}


/**
//To implements this class 
function Foo(){   
	...   
}
Foo.prototype = Object.create(AbstractEvent.prototype);
Foo.prototype.constructor = Foo;
Foo.prototype.load = function() {
	this.dispatch("load", {  ...  });
}



// Use it 
var myFoo = new Foo();

myFoo.on("load", function(){
	console.log('Hello');
}) 

*/


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
	},

	init: function(){

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
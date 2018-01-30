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
		var self = this;
		this.addLinks(this.defaultTarget);
		window.onpopstate = function(event) {
			// console.log(window.history);
			self.restoreFromState(event.state);
		};
		this.saveInitialState();
	},

	evaluateScripts: function(source){
		var scripts = source.querySelectorAll("script");
		for(var i=0; i<scripts.length; i++){
			eval(scripts[i].innerHTML);
		}
	},

	saveInitialState: function(){
		window.history.pushState({
			title: document.querySelector("title").innerHTML,
			body: document.body.innerHTML
		}, "Asap", document.location.href);
	},


	restoreFromState: function(state){
		document.title.innerHTML = state.title;
		document.body.innerHTML = state.body;
		Asap.evaluateScripts(document.body);
		Asap.addLinks(document.body);
	},


	implementEvent(c){
		var proto = Object.assign( {}, c.prototype);  			// Store originals proto
		c.prototype = AbstractEvent.prototype; 					// Implement events methods 
		c.prototype.constructor = c; 							// Override constructor
		c.prototype = Object.assign(c.prototype, proto); 		// Merge originals proto
	}

};

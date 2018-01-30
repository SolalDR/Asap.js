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


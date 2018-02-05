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
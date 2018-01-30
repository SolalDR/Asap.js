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


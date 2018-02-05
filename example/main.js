window.addEventListener("load", function(){
	Asap.start();
}, false)

document.addEventListener("asap:load", function(){
	console.log("Log from local main replace now");
})
window.addEventListener("load", function(){
	Asap.start({
		targetSelector: "#body",
		sourceSelector: "#body"
	});
}, false)

document.addEventListener("asap:load", function(){
	console.log("Log from local main replace now");
})
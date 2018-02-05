window.addEventListener("load", function(){
	Asap.start();
}, false)



document.addEventListener("asap:before-load", function(e){
	console.log("Before load");

	// ... Do some modification

	e.preventDefault();

	// ... Do some animation

	setTimeout(function(){
		
		// Finaly load the visit
		e.detail.load();
	}, 1000)
})

document.addEventListener("asap:load", function(){
	console.log("Now i'm load");
})
# Asap.js

[![codebeat badge](https://codebeat.co/badges/cccf2811-305f-4b8c-be2a-b1185f60240e)](https://codebeat.co/projects/github-com-solaldr-asap-js-master)
[![Maintainability](https://api.codeclimate.com/v1/badges/7b84dccff13eb4395c81/maintainability)](https://codeclimate.com/github/SolalDR/Asap.js/maintainability)
[![Build Status](https://travis-ci.org/SolalDR/Asap.js.svg?branch=master)](https://travis-ci.org/SolalDR/Asap.js)
[![npm version](https://badge.fury.io/js/asap-js.svg)](https://badge.fury.io/js/asap-js)

Create a smooth and animated navigation through your web pages. 
A click on a link generate a XHR request and load the content asynchronous. 

## Installation

### With npm
``` bash
npm install asap-js
```
``` javascript
var Asap = require("asap-js");

// In your main script (be careful, the script must be present in each page to be launched on the first load)
window.addEventListener("load", function(){
  Asap.start();
})
```

### With git
``` bash
git clone https://github.com/SolalDR/Asap.js.git
```
Add the script in the head of your documents (don't forget defer)
``` html
<script defer src="path/to/asap-js/dist/asap.js"></script>
```
``` javascript
// In your main script (be careful, the script must be present in each page to be launched on the first load)
window.addEventListener("load", function(){
  Asap.start();
})
```


## How to use


### Configuration

The configuration of Asap.js can be done in two ways. Either by passing a literal object when launching the `Asap.start()` method, or link by link with html attributes.

#### Initialisation

By default, Asap.js will update the entire document. However, it may be desirable to update only part of the document if you need for example to keep your header or a video playing in background. 

For this reason, you can override this default behavior during the initialisation.
In the example below, only the node with id "myCustomElement2" will be catch and his content will replace the content of the node with id "myCustomElement2".

 ``` javascript
document.addEventListener("load", function(){
	
	Asap.start({
		sourceSelector: "#myCustomElement",
		targetSelector: "#myCustomElement2"
	})

});
```

#### Attributes

Several attributes are available to override the default behaviors.

- `data-asap-source` : The html node selector whose content will be replaced
- `data-asap-target` : The node selector whose contents will be retrieved after the ajax response
- `data-asap-off` : The link will works in the normal way


### Events

Asap offers a usefull events's system to interact at any moment during the life cycle of a visit.

#### Load
This event fire after parse the ajax response and updating the DOM.
It's the equivalent of the classic "window.onload" event for Asap.js.  

 ``` javascript
document.addEventListener("asap:load", function(event){
	
	// Return the loaded visit
	console.log(event.detail); 

	// represent the node which has been updated (body by default)
	console.log(event.detail.source); 

});
```

#### Before Load
This event fire after parse the ajax response and before updating the DOM.
It is a very usefull event because it allow to make changes on the actual DOM before update.

 ``` javascript
document.addEventListener("asap:before-load", function(e){
	// ... Do some modification
})
```

You can also stop the current visit and load the visit later (or not)
 ``` javascript
document.addEventListener("asap:before-load", function(e){
	// The visit will not be loaded
	e.preventDefault();

	setTimeout(function(){
		// Execute the load method of visit object 1sec later
		e.detail.load();
	}, 1000)
})
```


## How does it work

- All the link `<a>` are detect at the begining.
- On a click the `href` attribute is transformed in a formated URL (if possible) 
- An ajax request is send to this URL
- The raw content of the response is parsed in a virtual HTMLDocument
- The node source in the actual document is replaces by the target node (by default, those elements are `<body>`)  

## Compatibility

Asap.js is write in ES5 syntax.

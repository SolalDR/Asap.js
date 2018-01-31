# Asap.js

[![codebeat badge](https://codebeat.co/badges/cccf2811-305f-4b8c-be2a-b1185f60240e)](https://codebeat.co/projects/github-com-solaldr-asap-js-master)
[![Maintainability](https://api.codeclimate.com/v1/badges/7b84dccff13eb4395c81/maintainability)](https://codeclimate.com/github/SolalDR/Asap.js/maintainability)

Create a smooth and animated navigation through your web pages. 
A click on a link generate a XHR request and load the content asynchronous. 


## How to use

Add the script in the head of your documents (don't forget defer)
``` html
<script defer src="path/to/asaplink.js"></script>
```

## How does it work

- All the link `<a>` are detect at the begining.
- On a click the `href` attribute is transformed in a formated URL (if possible) 
- An ajax request is send to this URL
- The raw content of the response is parsed in a virtual HTMLDocument
- The node source in the actual document is replaces by the target node (by default, those elements are `<body>`)  

## Compatibility

Asap.js is write in ES5 syntax.

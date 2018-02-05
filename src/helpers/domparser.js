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





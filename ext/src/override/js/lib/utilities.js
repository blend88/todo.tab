/*
*	Utility functions
*/

var _88 = _88 || {};

_88.util = { 
   	getSelectedText: function() {
	    var text = "";
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	}
};
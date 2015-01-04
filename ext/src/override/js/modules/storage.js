var storageArea = chrome.storage.sync;
//storageArea.clear(null);

angular.module('storage.service', [])
	.service('storageService', function() {
	 	var self = this;
	 	this.debug = true; //set to true to enable debugging

	 	//listen for changes in other tabs / browsers
	    this.listen = function(callback) {
	    	chrome.storage.onChanged.addListener(function(changes, namespace) {
	    		callback(changes);

	    		if(self.debug)
		    		for (var key in changes) 
				    {
				      var change = changes[key];
				      console.debug('Storage key "%s" in namespace "%s" changed. ' +
				                  'Old value was "%s", new value is "%s".',
				                  key,
				                  namespace,
				                  change.oldValue,
				                  change.newValue);
				    }
	    	});
	    };

	    //callback is passes the items (object with keys as values) returned from storage
	    this.get = function(keys, callback) {
			storageArea.get(keys, function(items) {
				callback(items);

				if(self.debug) {
					console.debug("Items returned from storage: ");
					console.debug(items);
				}
	        });
		};

	    this.set = function(values, callback) {
			storageArea.set(values, callback);

			if(self.debug) {
				console.debug("Items sent to storage: ");
				console.debug(values);
			}
		};

	    this.clear = function(){
	    	storageArea.clear(null);

	    	if(self.debug) {
				console.debug("Storage cleared");
			}
	    };
	});

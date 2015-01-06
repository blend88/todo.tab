var storageArea = chrome.storage.sync;
//storageArea.clear(null);

angular.module('storage.service', [])
	.service('storageService', function() {
	 	var self = this;
	 	this.debug = false; //set to true to enable debugging

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
;
function Todo(name) {
	if(typeof(name)==='undefined') name = "";
   	this.id = Math.random().toString(36).substring(7);
   	this.name = name;
   	this.created = Date.now();
   	this.done = false;
   	this.completed = null;
}

angular.module('todo.service', ['storage.service'])
	.service('todoService', ['storageService', function(storageService) {
	 	
  		console.log("Initialized todoService");

	  	this.todos = []; 
	  	var self = this;
	  	
	  	this.load = function(callback) {
			storageService.get(["todos"], function(items) {
				// Notify that we saved.
				console.log("todos.loaded");

				if(items.todos === undefined || items.todos === null)
					items.todos = [
							new Todo("Start your list here..."), 
							new Todo("Learn about the Markdown syntax: https://help.github.com/articles/markdown-basics/"),
							new Todo("Toggle *Markdown Preview* by pressing `Ctrl + M`"),
							new Todo("Cross this item off by pressing `Ctrl + D`"),
							new Todo("Delete a list item with `Esc`"),
							]; //default

				console.log(items.todos);

				// $scope.$apply(function(){
				//   	$scope.todos = items.todos;
				// });

				callback(items.todos);

	        });
		};
		
		this.save = function() {
			storageService.set({'todos': self.todos}, function() {
	          // Notify that we saved.
	          console.log("todos.saved");
	        });
		};

		this.addTodo = function(afterItem) {
			var todo = new Todo();

			if(afterItem) {
				var index = _.findIndex(self.todos, { 'id': afterItem });
				self.todos.splice(index+1, 0, todo);
		  	} 
		  	else {
		  		self.todos.push(todo); //add to end of the list
		  		console.log("todo.added");
		  	}

		  	console.log("todo.added " + todo.id);

		  	return {todos: self.todos};

		};

		this.removeTodo = function(todo) {
			_.remove(self.todos, { 'id': todo });
		  	console.log("todo.removed " + todo);
		  	self.save();
		  	return self.todos;
		};

		this.reset = function() {
			storageservice.clear();
		};
	}]);

angular.module('todo.directive', [])
	.directive('todo', ['$rootScope', function ($rootScope) {
	    return function (scope, element, attrs) {
	    	
	    	//console.log("todo directive for " + scope.todo.id);

	        element.bind("keydown", function (event) {
	            if(event.which === 13) { //Enter key                
	                //Chrome extension work around hack
	                event.preventDefault();
	        		$rootScope.$broadcast('ENTER_PRESSED', {afterItem: attrs.id});
	        		$(this).closest('li').next().find('.todo').focus();
	            } else if (event.which === 27) { //Escape
	            	event.preventDefault();
	            	$(this).closest('li').prev().find('.todo').focus();
	            	$rootScope.$broadcast('REMOVE_TODO', {todo: attrs.id});
				} else if (event.which === 8) { //Backspace
	            	if($(this).val() === "")
	            	{
	            		event.preventDefault();
	            		$(this).closest('li').prev().find('.todo').focus(); 
	            		$rootScope.$broadcast('REMOVE_TODO', {todo: attrs.id});          
	            	}
	            } else if (event.which === 38) { //Up
	            	event.preventDefault();
	            	$(this).closest('li').prev().find('.todo').focus();
	            	
	            } else if (event.which === 40) { //Down
	            	event.preventDefault();
	            	$(this).closest('li').next().find('.todo').focus();
	            } else if (event.ctrlKey && event.which === 68) { //Ctrl + D
	            	event.preventDefault();
	            	
	            	//strikeout with markdown
	            	var val = $(this).val();
	            	var matches = val.match(/^~~(.*)~~$/);

	            	if(matches)
	            		$(this).val(matches[1]);
	            	else 
	            		$(this).val("~~" + val.replace(/~~/gi, "") + "~~");

	            	$(this).trigger("change");
	            }

	        });

	        //element.focus();
	    };
	}]);

angular.module('todo.filter', [])
	.filter('renderMarkdown', function() {
		return function(input) {
			input = input || '';
			var out = "";
			out = marked(input);
			return out;
		};
	});

angular.module('todo', ['todo.service', 'todo.directive', 'todo.filter']);
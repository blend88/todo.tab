
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

				callback(items.todos);

	        });
		};
		
		this.save = function() {
			storageService.set({'todos': self.todos}, function() {
	          	// Notify that we saved.
	          	console.log("todos.saved");
	        });
		};

		this.addTodo = function(atIndex) {
			var todo = new Todo();

			if(atIndex >= 0) {
				self.todos.splice(atIndex, 0, todo);
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
	    	
	        element.bind("keydown", function (event) {
	        	var val = $(this).val();

	            if(event.which === 13) { //Enter key  

	                //Chrome extension work around hack
	                event.preventDefault();

	                var itemIndex = $(this).closest('li').index();
	                var cursorPosition = $(this)[0].selectionStart;

            		if (cursorPosition === 0) {
            			attrs.id = $(this).closest('li').prev().children(".todo").attr("id");
            			itemIndex--;
            		}

            		console.log("itemIndex: " + itemIndex);

	        		$rootScope.$broadcast('ENTER_PRESSED', {atIndex: itemIndex + 1});
	        		$(".todo-list li").eq(itemIndex + 1).find('.todo').focus();

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

	            } else if (event.ctrlKey && event.which === 66) { //Ctrl + B

	            	event.preventDefault();

            		var elem = $(this)[0];
            		var start = elem.selectionStart;
            		var end = elem.selectionEnd;

            		if(start === end)
            			return;

            		if(val.substring(start, start + 2) === "**" && val.substring(end - 2, end) === "**")
            		{
            			$(this).val(val.substring(0, start) + val.substring(start + 2, end - 2) + val.substring(end));

	            		elem.selectionStart = start;
	            		elem.selectionEnd = end - 4;
            		}
            		else
            		{
            			$(this).val(val.substring(0, start) + "**" + val.substring(start, end) + "**" + val.substring(end));

	            		elem.selectionStart = start;
	            		elem.selectionEnd = end + 4;
            		}

            		$(this).trigger("change");
            		
	            } else if (event.ctrlKey && event.which === 68) { //Ctrl + D

	            	event.preventDefault();
	            	
	            	//strikeout with markdown
	            	var matches = val.match(/^~~(.*)~~$/);

	            	if(matches)
	            		$(this).val(matches[1]);
	            	else 
	            		$(this).val("~~" + val.replace(/~~/gi, "") + "~~");

	            	$(this).trigger("change");
	            }

	        });
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
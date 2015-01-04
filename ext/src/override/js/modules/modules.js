var storageArea = chrome.storage.sync;
//storageArea.clear(null);

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) 
    {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
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

angular.module('todo.service', [])
	.service('todoService', function() {
	 	var self = this;

  		console.log("Initialized todoService");

	  	this.todos = [new Todo("Todos go here")]; //default value
	  	
	  	this.load = function(callback){
			storageArea.get(["todos", "title"], function(item) {
				// Notify that we saved.
				console.log("todos.loaded");

				if(item.todos === undefined || item.todos === null)
					item.todos = self.todos;//default

				if(item.title === undefined || item.title === null)
					item.title = "todo.tab";//default

				console.log(item.todos);
				// $scope.$apply(function(){
				//   	$scope.todos = item.todos;
				// });
				self.todos = item.todos;

				callback(item.title, self.todos);

	        });
		};
		
		this.save = function(title) {
			storageArea.set({'todos': self.todos, 'title': title}, function() {
	          // Notify that we saved.
	          console.log("todos.saved: " + title);
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
			storageArea.clear(null);
		};
	});

angular.module('todo.directive', [])
	.directive('todo', ['$rootScope', function ($rootScope) {
	    return function (scope, element, attrs) {
	    	
	    	console.log("todo directive for " + scope.todo.id);

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
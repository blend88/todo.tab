(function () {
	"use strict";

	/*
	*   Angular App 
	*/
	var app = angular.module('todoApp', ['ngSanitize', 'storage.service', 'todo']);

	app.controller('MainController', ['$scope', '$timeout', '$document', 'storageService', 'todoService', function($scope, $timeout, $document, storageService, todoService) {
		var timer = false;

		$scope.title = "todo.tab";
		$scope.preview = false;
		$scope.showMarkdown = false;
		$scope.markdown = "test";

		var updateScope = function(key, value) {
			if(value !== undefined)
		      	$scope[key] = value;
		};

		//load settings
		storageService.get(["title", "preview"], function(items) {
			console.log("settings.loaded");


			for (var key in items) 
		    {
		      	var item = items[key];
		      	console.debug('$scope["%s"] was loaded as "%s".', key, item);

		      	$scope.$apply(updateScope(key, item));
		    }
        });

		//load todos
		todoService.load(function(result){
			$scope.$apply(function(){
			   	$scope.todos = result;		
			});
		});

		//start listening for changes to storage from current tab and other tabs / browsers
		storageService.listen(function(changes){
			for (var key in changes) 
		    {
		      	var change = changes[key];
		      	console.debug('$scope["%s"] was changed from "%s" to "%s".', key, change.oldValue, change.newValue);

		      	$scope.$apply(updateScope(key, change.newValue));
		    }
		});

		$scope.$watch('todos', function(newValue, oldValue) {
			todoService.todos = $scope.todos;
		});

		$scope.titleChanged = function(){
			if(timer) {
		      	$timeout.cancel(timer);
		  	}  
		  	timer = $timeout(function() {
		  		storageService.set({'title': $scope.title}, function() {
		          	console.log("title.saved");
		        });
		      	timer = false;
		   	}, 1000);
		};

		$scope.todosChanged = function(){
			if(timer) {
		      	$timeout.cancel(timer);
		  	}  
		  	timer = $timeout(function() {
		  		todoService.save();
		      	timer = false;
		   	}, 1000);
		};

		$scope.displayMarkdown = function(){
			//build list as markdown
			var markdown = $scope.title + "\r\n";
			markdown += new Array($scope.title.length + 1).join("=");
			markdown += "\r\n";
			
			for (var i in $scope.todos) {
				markdown += "- " + $scope.todos[i].name;
				markdown += "\r\n";
			}
			
			$scope.markdown = markdown;
			$scope.showMarkdown = !$scope.showMarkdown;
		};

		$scope.previewMarkdown = function(){
			$scope.preview =! $scope.preview;

			//save preview state
			storageService.set({'preview': $scope.preview}, null);
		};

		$scope.$on('ENTER_PRESSED', function (event, data) {
			var result = todoService.addTodo(data.afterItem);
			$scope.$apply(function(){
		  		$scope.todos = result.todos;
		  		console.log($scope.todos);
		  	});
		});

		$scope.$on('REMOVE_TODO', function (event, data) {
			if ($scope.todos.length == 1)
				return; //prevent empty list

			var result = todoService.removeTodo(data.todo);
			$scope.$apply(function(){
		  		$scope.todos = result;
		  		console.log($scope.todos);
		  	});
		});

		//Global keyboard shortcut (Ctrl + M, or Alt + M)
		$document.bind("keypress", function(event) {
			if ((event.ctrlKey || event.altKey) && event.keyCode == 13)
	        	$scope.$apply(function(){
	        		$scope.preview = !$scope.preview;
	        	});
	    });
	}]);
}());
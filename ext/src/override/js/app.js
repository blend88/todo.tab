'use strict';

/*
*   Angular App 
*/

var app = angular.module('todoApp', ['ngSanitize', 'todo']);

app.controller('MainController', ['$scope', '$timeout', '$document','todoService', function($scope, $timeout, $document, todoService) {
	var timer = false;

	$scope.title = "todo.tab";
	$scope.preview = false;
	$scope.showMarkdown = false;
	$scope.markdown = "test";

	$scope.todos = todoService.load(function(title, result){
		$scope.$apply(function(){
			$scope.title = title;
		   	$scope.todos = result;
		});
	});

	$scope.changed = function(){
		if(timer) {
	      	$timeout.cancel(timer)
	  	}  
	  	timer = $timeout(function() {
	  		todoService.save($scope.title);
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

	$document.bind("keypress", function(event) {
		if ((event.ctrlKey || event.altKey) && event.keyCode == 13)
        	$scope.$apply(function(){
        		$scope.preview = !$scope.preview;
        	});
    });

}]);
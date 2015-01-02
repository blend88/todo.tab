'use strict';

/*
*   Angular App 
*/

var app = angular.module('todoApp', ['TodoService']);

app.directive('todo', ['$rootScope', function ($rootScope) {
    return function (scope, element, attrs) {
    	
    	console.log("todo directive for " + scope.todo.id);

        element.bind("keydown", function (event) {
            if(event.which === 13) { //Enter key                
                //Chrome extension work around hack
        		$rootScope.$broadcast('ENTER_PRESSED', {afterItem: attrs.id});
                event.preventDefault();
            } else if (event.which === 27) { //Escape
            	$rootScope.$broadcast('REMOVE_TODO', {todo: attrs.id});
			} else if (event.which === 8) { //Backspace
            	if($(this).val() === "")
            		$rootScope.$broadcast('REMOVE_TODO', {todo: attrs.id});           
            } else if (event.which === 38) { //Up
            	event.preventDefault();
            	$(this).closest('li').prev().find('.todo').focus();
            	
            } else if (event.which === 40) { //Down
            	event.preventDefault();
            	$(this).closest('li').next().find('.todo').focus();
            }
        });
        element.focus();
    };
}]);

app.controller('MainController', ['$scope', '$timeout', 'todoService', function($scope, $timeout, todoService) {
	var timer = false;

	$scope.todos = todoService.load(function(result){
		$scope.$apply(function(){
		   	$scope.todos = result;
		});
	});

	$scope.changed = function(){
		if(timer) {
	      	$timeout.cancel(timer)
	  	}  
	  	timer = $timeout(function() {
	  		todoService.save();
	      	timer = false;
	   	}, 1000);
	};

	$scope.$on('ENTER_PRESSED', function (event, data) {
		var result = todoService.addTodo(data.afterItem);
		$scope.$apply(function(){
	  		$scope.todos = result.todos;
	  		console.log($scope.todos);
	  	});
	});

	$scope.$on('REMOVE_TODO', function (event, data) {
		var result = todoService.removeTodo(data.todo);
		$scope.$apply(function(){
	  		$scope.todos = result;
	  		console.log($scope.todos);
	  	});
	});

}]);
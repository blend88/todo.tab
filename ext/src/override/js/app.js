'use strict';

/*
*   Angular App 
*/
var storageArea = chrome.storage.sync;
var app = angular.module('todoApp', []);

app.directive('ngEnter', ['$rootScope', function ($rootScope) {
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if(event.which === 13) {
                console.log(scope);
                // scope.$apply(function (){
                //     scope.$eval(attrs.ngEnter);
                // });
        		$rootScope.$broadcast('ENTER_PRESSED', {element: element});
                event.preventDefault();
            }
        });
    };
}]);

app.controller('MainController', ['$scope', '$timeout', function($scope, $timeout) {
	var timer = false;
	$scope.todos = [];

	//storageArea.clear(null);


	$scope.load = function(){
		storageArea.get("todos", function(item) {
			// Notify that we saved.
			console.log("todos.loaded");

			if(item.todos == undefined || item.todos == null)
				item.todos = [{name: "Todos go here"}];//default

			console.log(item.todos);
			$scope.$apply(function(){
			  	$scope.todos = item.todos;
			});
        });
	};
	
	$scope.save = function(){
		storageArea.set({'todos': $scope.todos}, function() {
          // Notify that we saved.
          console.log("todos.saved");
        });
	};
	
	$scope.changed = function(){
		if(timer) {
	      	$timeout.cancel(timer)
	  	}  
	  	timer = $timeout(function() {
	  		$scope.save();
	      	timer = false;
	   	}, 1000);
	};

	$scope.addTodo = function(afterElement) {
		if(afterElement) {
	      	
	  	} 
	  	else {

	  	}
	  	$scope.$apply(function(){
	  		$scope.todos.push({name: ""});
	  	});

	};

	$scope.$on('ENTER_PRESSED', function (event, data) {
	  	$scope.addTodo(data.element); 
	});

	$scope.load();

}]);
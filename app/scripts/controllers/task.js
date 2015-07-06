'use strict';

/**
 * @ngdoc function
 * @name powertimerApp.controller:MainCtrl
 * @description
 * # TaskCtrl
 * Controller of the powertimerApp
 */
 angular.module('powertimerApp')
.controller('TaskCtrl', function($scope, $firebaseArray, Firebase, $interval){
  var url = 'https://jennifer.firebaseio.com/tasks';
  var fireRef = new Firebase(url).limitToLast(10);

  $scope.tasks = $firebaseArray(fireRef);
  $scope.newTask = '';
  $scope.showBoxOne = false;

  $scope.timeOut = function(){
      $scope.showBoxOne = !$scope.showBoxOne;
  };

  $scope.addTask = function () {
    var newTask = $scope.newTask.trim();
    if (!newTask.length) {
      return;
    }
    $scope.tasks.$add({
      title: newTask,
      created: Firebase.ServerValue.TIMESTAMP
    });
    $scope.newTask = '';
  };

  $scope.editTask = function (task) {
    $scope.editedTask = task;
    $scope.originalTask = angular.extend({}, $scope.editedTask);
  };

  $scope.doneEditing = function (task) {
    $scope.editedTask = null;
    var title = task.title.trim();
    if (title) {
      $scope.tasks.$save(task);
    } else {
      $scope.removeTask(task);
    }
  };

  $scope.removeTask = function(task){
    $scope.tasks.$remove(task);
  };

  $scope.revertEditing = function (task) {
    task.title = $scope.originalTask.title;
    $scope.doneEditing(task);
  };

})

'use strict';

/**
 * @ngdoc overview
 * @name powertimerApp
 * @description
 * # powertimerApp
 *
 * Main module of the application.
 */

angular.module('powertimerApp', ['firebase'])

.constant('WORK_TIME', 10)
.constant('BREAK_TIME', 4)
.constant('LONG_BREAK', 6)

.controller('TaskCtrl', function($scope, $firebaseArray, Firebase, $interval){
  var url = 'https://jennifer.firebaseio.com/tasks';
  var fireRef = new Firebase(url);

  $scope.tasks = $firebaseArray(fireRef);
  $scope.newTask = '';

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

})

.filter('secondsToMin', function () {
  return function(pseconds){
    var sec_num = parseInt(pseconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
  }
})

.directive('powerTimer', function($interval, WORK_TIME, BREAK_TIME, LONG_BREAK) {
  return {
    restrict: 'E',
    templateUrl: '/views/timer.html',
    scope: true,
    link: function(scope, element, attributes) {
        scope.work = 'Work';
        scope.timer = WORK_TIME;
        var intervalNum = 1;
        var stop;
        var mySound = new buzz.sound( '/sounds/ginger.mp3', {
          preload: true
        });

        scope.startTimer = function() {
          // Don't start a new start if we are already starting
          if ( angular.isDefined(stop) ) return;

          stop = $interval(function() {
              if (scope.timer > 0) {
                scope.timer --;
              } else {

                scope.stopTimer(scope.work);
              }
            }, 1000);
          };

          scope.stopTimer = function(item) {
            if (angular.isDefined(stop)) {
              mySound.play();
              $interval.cancel(stop);
              if(item === 'Work'){
                if(intervalNum === 4){
                  scope.work = 'Long Break';
                  scope.timer = LONG_BREAK;
                  intervalNum = 1;
                } else {
                  scope.work = 'Break';
                  scope.timer = BREAK_TIME;
                  intervalNum ++;
                };
              } else {
                scope.work = 'Work';
                scope.timer = WORK_TIME;
              };
              console.log(intervalNum);
            stop = undefined;
            }
          };

          scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            scope.stop();
          });
      }
    }
})

.directive('myCurrentTime', function($interval, dateFilter) {
    return function(scope, element, attrs) {
      var format = 'M/d/yy h:mm a';
          var stopTime; // so that we can cancel the time updates

      // used to update the UI
      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }

      // watch the expression, and update the UI on change.
      scope.$watch(attrs.myCurrentTime, function() {
        // format = value;
        updateTime();
      });

      stopTime = $interval(updateTime, 1000);

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.on('$destroy', function() {
        $interval.cancel(stopTime);
      });
    }
  });


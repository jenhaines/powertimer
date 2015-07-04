'use strict';

angular
.module('taskFocus',[])
.directive('taskFocus', function taskFocus($timeout) {
  return function (scope, elem, attrs) {
    scope.$watch(attrs.taskFocus, function (newVal) {
      if (newVal) {
        $timeout(function () {
          elem[0].focus();
        }, 0, false);
      }
    });
  };
});

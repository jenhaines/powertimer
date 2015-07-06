'use strict';

angular
.module('powertimerApp')
.directive('taskBlur', function () {
  return function (scope, elem, attrs) {
    elem.bind('blur', function () {
      scope.$apply(attrs.taskBlur);
    });

    scope.$on('$destroy', function () {
      elem.unbind('blur');
    });
  };
});
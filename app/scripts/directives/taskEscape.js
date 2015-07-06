'use strict';

angular
.module('taskEscape',[])
  .directive('taskEscape', function () {
    var ESCAPE_KEY = 27;
    return function (scope, elem, attrs) {

      elem.bind('keydown', function (event) {
        if (event.keyCode === ESCAPE_KEY) {
          scope.$apply(attrs.taskEscape);
        }
      });

      scope.$on('$destroy', function () {
        elem.unbind('keydown');
      });
    };
  });

"use strict";angular.module("powertimerApp",["firebase","ngAnimate"]).constant("WORK_TIME",1500).constant("BREAK_TIME",300).constant("LONG_BREAK",1800).filter("secondsToMin",function(){return function(a){var b=parseInt(a,10),c=Math.floor(b/3600),d=Math.floor((b-3600*c)/60),e=b-3600*c-60*d;10>c&&(c="0"+c),10>d&&(d="0"+d),10>e&&(e="0"+e);var f=d+":"+e;return f}}).directive("powerTimer",["$interval","WORK_TIME","BREAK_TIME","LONG_BREAK",function(a,b,c,d){return{restrict:"E",templateUrl:"/views/timer.html",scope:!0,link:function(e,f,g){e.work="Work",e.timer=b;var h,i=1,j=new buzz.sound("/sounds/ginger.mp3",{preload:!0}),k=new buzz.sound("/sounds/saliva.mp3",{preload:!0});e.startTimer=function(){angular.isDefined(h)||(e.isActive=!0,h=a(function(){e.timer>1?(4===e.timer&&e.timeOut(),e.timer<=4&&k.play(),e.timer--):1===e.timer?(e.timer--,j.play()):e.stopTimer(e.work)},1e3))},e.stopTimer=function(f){angular.isDefined(h)&&(a.cancel(h),"Work"===f?4===i?(e.work="Long Break",e.timer=d,i=1):(e.work="Break",e.timer=c,i++):(e.work="Work",e.timer=b),h=void 0,e.isActive=!1,e.timeOut())},e.$on("$destroy",function(){e.stop()})}}}]).directive("myCurrentTime",["$interval","dateFilter",function(a,b){return function(c,d,e){function f(){d.text(b(new Date,h))}var g,h="M/d/yy h:mm a";c.$watch(e.myCurrentTime,function(){f()}),g=a(f,1e3),d.on("$destroy",function(){a.cancel(g)})}}]),angular.module("powertimerApp").controller("TaskCtrl",["$scope","$firebaseArray",function(a,b){var c="https://jennifer.firebaseio.com/tasks",d=new Firebase(c).limitToLast(10);a.tasks=b(d),a.newTask="",a.showBoxOne=!1,a.timeOut=function(){a.showBoxOne=!a.showBoxOne},a.addTask=function(){var b=a.newTask.trim();b.length&&(a.tasks.$add({title:b,created:Firebase.ServerValue.TIMESTAMP}),a.newTask="")},a.editTask=function(b){a.editedTask=b,a.originalTask=angular.extend({},a.editedTask)},a.doneEditing=function(b){a.editedTask=null;var c=b.title.trim();c?a.tasks.$save(b):a.removeTask(b)},a.removeTask=function(b){a.tasks.$remove(b)},a.revertEditing=function(b){b.title=a.originalTask.title,a.doneEditing(b)}}]),angular.module("powertimerApp").directive("taskEscape",function(){var a=27;return function(b,c,d){c.bind("keydown",function(c){c.keyCode===a&&b.$apply(d.taskEscape)}),b.$on("$destroy",function(){c.unbind("keydown")})}}),angular.module("powertimerApp").directive("taskFocus",["$timeout",function(a){return function(b,c,d){b.$watch(d.taskFocus,function(b){b&&a(function(){c[0].focus()},0,!1)})}}]),angular.module("powertimerApp").directive("taskBlur",function(){return function(a,b,c){b.bind("blur",function(){a.$apply(c.taskBlur)}),a.$on("$destroy",function(){b.unbind("blur")})}});
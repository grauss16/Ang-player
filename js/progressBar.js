angular.module('Progress', [])
        .directive('progressbar', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<div id="progress" class="progress"><div>',
                scope: {
                    'ngEnabled': '=',
                    'max': '=',
                    'at': '='
                },
                link: function(scope, element, attrs) {
                    element.slider({
                        range: "min",
                        min: 0,
                        value: 0,
                        start: function(event, ui) {

                        }
                    });
                    element.on('slide', function(event, ui) {
                        scope.$apply(function() {
                            scope.$parent.pause();                      
                            scope.$parent.setCurrent( ui.value);
                        });
                    });
                    
                    element.on('slidestop', function(event, ui) {
                        scope.$apply(function() {   
                           scope.$parent.play(); 
                        });
                    });
                scope.$watch('max', function(value) {
                        element.slider('option', 'max', value);
                       
                    });
                    scope.$watch('at', function(value) {
                        element.slider('option', 'value', value);
                    });
                    scope.$watch('ngEnabled', function(value) {
                        element.attr('enabled', value);
                        if (value) {
                            element.slider('enable');
                        } else {
                            element.slider('disable');
                        }
                    });
                }
            };
        });
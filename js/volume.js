angular.module('Volume', [])
        .directive('volumebar', function() {
            var tooltip = $('.tooltip');
            tooltip.hide();
            return {
                restrict: 'E',
                replace: true,
                template: '<div id="slider"><div>',
                scope: {
                    'ngEnabled': '=',
                    'max': '=',
                    'at': '='
                },
                link: function(scope, element, attrs) {
                    element.slider({
                        range: "min",
                        min: 0,                 
                        value: 100,
                        start: function(event, ui) {
                            tooltip.fadeIn('fast');
                            tooltip.css('left', ui.value).text(ui.value);
                        }
                    });
                    element.on('slide', function(event, ui) {
                        scope.$apply(function() {
                            var volume = $('.volume');
                            tooltip.css('left', ui.value).text(ui.value);
                            scope.$parent.volumenBar.at = ui.value;
                            scope.$parent.audio.volume = ui.value / 100;
                            if (ui.value <= 5) {
                                volume.css('background-position', '0 0');
                            }
                            else if (ui.value <= 25) {
                                volume.css('background-position', '0 -25px');
                            }
                            else if (ui.value <= 75) {
                                volume.css('background-position', '0 -50px');
                            }
                            else {
                                volume.css('background-position', '0 -75px');
                            }

                        });
                    });
                    element.on('slidestop', function(event, ui) {
                        scope.$apply(function() {
                            scope.$parent.volumenBar.at = ui.value;
                            tooltip.fadeOut('fast');
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